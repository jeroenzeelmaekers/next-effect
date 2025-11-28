import { HttpClient, HttpClientRequest } from "@effect/platform";
import { NodeHttpClient } from "@effect/platform-node";
import { Context, Effect, Layer } from "effect";

export class ApiClient extends Context.Tag("ApiClient")<
  ApiClient,
  HttpClient.HttpClient
>() {}

const ApiClientLive = Layer.effect(
  ApiClient,
  Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient;
    return httpClient.pipe(
      HttpClient.filterStatusOk,
      HttpClient.mapRequest(
        HttpClientRequest.prependUrl("https://jsonplaceholder.typicode.com"),
      ),
    );
  }),
);

export const ApiLive = ApiClientLive.pipe(Layer.provide(NodeHttpClient.layer));
