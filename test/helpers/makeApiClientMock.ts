import { ApiClient } from "@/lib/api/client";
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Effect, Layer } from "effect";

export const makeApiClientMock = (body: unknown, status = 200) =>
  Layer.succeed(
    ApiClient,
    HttpClient.makeWith(
      (req) =>
        req.pipe(
          Effect.map((request) =>
            HttpClientResponse.fromWeb(
              request,
              new Response(JSON.stringify(body), {
                status,
                headers: { "Content-Type": "application/json" },
              }),
            ),
          ),
        ),
      (req) =>
        Effect.succeed(HttpClientRequest.prependUrl("http://localhost")(req)),
    ).pipe(HttpClient.filterStatusOk) as HttpClient.HttpClient,
  );
