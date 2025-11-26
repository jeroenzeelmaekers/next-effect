import { Effect, Schema } from "effect";
import { ApiClient, ApiLive } from "./client";
import { HttpClientResponse } from "@effect/platform";
import { User } from "./schema";
import { NetworkError, UserNotFound, ValidationError } from "./errors";

export const getUsers = Effect.gen(function* () {
  const client = yield* ApiClient;
  const response = yield* client.get("/users");
  return yield* HttpClientResponse.schemaBodyJson(Schema.Array(User))(response);
}).pipe(
  Effect.scoped,
  Effect.withSpan("getUsers"),
  Effect.catchTags({
    RequestError: (error) =>
      Effect.fail(new NetworkError({ message: error.message })),
    ResponseError: (error) =>
      error.response.status === 404
        ? Effect.fail(new UserNotFound({ userId: 0 }))
        : Effect.fail(new NetworkError({ message: error.message })),
    ParseError: (error) =>
      Effect.fail(new ValidationError({ message: String(error) })),
  }),
);

export const getUsersSafe = () =>
  Effect.runPromise(getUsers.pipe(Effect.provide(ApiLive), Effect.either));
