import { Effect, Either } from "effect";
import { describe, expect } from "vitest";
import { layer } from "@effect/vitest";
import { getUsers } from "./services";
import { UserNotFound, ValidationError } from "./errors";
import { makeApiClientMock } from "@/test/helpers/makeApiClientMock";

const ApiClientMock = makeApiClientMock([
  { id: 1, name: "John", username: "john_doe", email: "john@example.com" },
  { id: 2, name: "Jane", username: "jane_doe", email: "jane@example.com" },
]);
const ApiClient404 = makeApiClientMock({}, 404);
const ApiClientInvalidData = makeApiClientMock([{ invalid: "data" }]);

describe("GetUsers", () => {
  layer(ApiClientMock)((it) => {
    it.effect("returns users on success", () =>
      Effect.gen(function* () {
        const users = yield* getUsers;
        expect(users).toHaveLength(2);
        expect(users[0].name).toBe("John");
      }),
    );
  });

  layer(ApiClient404)((it) => {
    it.effect("returns UserNotFound on 404", () =>
      Effect.gen(function* () {
        const result = yield* Effect.either(getUsers);
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
          expect(result.left).toBeInstanceOf(UserNotFound);
        }
      }),
    );
  });

  layer(ApiClientInvalidData)((it) => {
    it.effect("returns ValidationError on invalid data", () =>
      Effect.gen(function* () {
        const result = yield* Effect.either(getUsers);
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
          expect(result.left).toBeInstanceOf(ValidationError);
        }
      }),
    );
  });
});
