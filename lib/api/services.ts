import { Effect, Schedule, Schema } from "effect";
import { ApiClient } from "./client";
import { HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { CreateUser, User } from "./schema";
import { NetworkError, UserNotFound, ValidationError } from "./errors";
import { runtime } from "../runtime";
import { Result } from "@effect-atom/atom-react";

const getUsersEffect = Effect.gen(function* () {
  const client = yield* ApiClient;
  const request = HttpClientRequest.get("/users");
  const response = yield* client.execute(request);
  return yield* HttpClientResponse.schemaBodyJson(Schema.Array(User))(response);
}).pipe(
  Effect.scoped,
  Effect.withSpan("getUsers"),
  Effect.timeout("5 seconds"),
  Effect.catchTags({
    RequestError: (error) =>
      Effect.fail(new NetworkError({ message: error.message })),
    ResponseError: (error) =>
      error.response.status === 404
        ? Effect.fail(new UserNotFound({ userId: 0 }))
        : Effect.fail(new NetworkError({ message: error.message })),
    ParseError: (error) =>
      Effect.fail(new ValidationError({ message: String(error) })),
    TimeoutException: (error) =>
      Effect.fail(new NetworkError({ message: error.message })),
  }),
);

export const getUsers = async () => {
  const exit = await runtime.runPromiseExit(getUsersEffect);
  return Result.fromExit(exit);
};

export const createUserFn = (data: typeof CreateUser.Type) =>
  Effect.gen(function* () {
    const client = yield* ApiClient;
    const request = HttpClientRequest.post("/users").pipe(
      HttpClientRequest.bodyJson(data),
    );
    const response = yield* client.execute(yield* request);
    return yield* HttpClientResponse.schemaBodyJson(User)(response);
  }).pipe(
    Effect.scoped,
    Effect.retry({
      schedule: Schedule.exponential("100 millis").pipe(
        Schedule.compose(Schedule.recurs(3)),
      ),
      while: (error) =>
        error._tag === "RequestError" || error._tag === "ResponseError",
    }),
    Effect.withSpan("createUser"),
    Effect.catchTags({
      RequestError: (error) =>
        Effect.fail(new NetworkError({ message: error.message })),
      ResponseError: (error) =>
        Effect.fail(new NetworkError({ message: error.message })),
      ParseError: (error) =>
        Effect.fail(new ValidationError({ message: String(error) })),
    }),
  );

export const createUser = async (data: typeof CreateUser.Type) => {
  const exit = await runtime.runPromiseExit(createUserFn(data));
  return Result.fromExit(exit);
};
