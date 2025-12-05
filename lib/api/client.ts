import {
  HttpClient,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { NodeHttpClient } from "@effect/platform-node";
import { Config, Context, Effect, Layer } from "effect";
import { AccessTokenError, Auth, AuthLive } from "../auth";

export interface AuthenticatedClient {
  readonly execute: (
    request: HttpClientRequest.HttpClientRequest,
  ) => Effect.Effect<
    HttpClientResponse.HttpClientResponse,
    HttpClientError.HttpClientError | AccessTokenError
  >;
}

export class ApiClient extends Context.Tag("ApiClient")<
  ApiClient,
  AuthenticatedClient
>() {}

const ApiClientLive = Layer.effect(
  ApiClient,
  Effect.gen(function* () {
    const baseUrl = yield* Config.string("API_BASE_URL");
    const auth = yield* Auth;
    const httpClient = yield* HttpClient.HttpClient;

    const client = httpClient.pipe(
      HttpClient.filterStatusOk,
      HttpClient.mapRequest(HttpClientRequest.prependUrl(baseUrl)),
    );

    return {
      execute: (request: HttpClientRequest.HttpClientRequest) =>
        Effect.gen(function* () {
          const token = yield* auth.getAccessToken;
          const authenticatedRequest = request.pipe(
            HttpClientRequest.bearerToken(token),
          );
          return yield* client.execute(authenticatedRequest);
        }),
    };
  }),
);

export const ApiLive = ApiClientLive.pipe(
  Layer.provide(NodeHttpClient.layer),
  Layer.provide(AuthLive),
);
