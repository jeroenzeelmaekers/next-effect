import { getAccessToken } from "@auth0/nextjs-auth0";
import { Context, Data, Effect, Layer } from "effect";

export class AccessTokenError extends Data.TaggedError("AccessTokenError")<{
  message: string;
  cause?: unknown;
}> {}

export interface AuthService {
  readonly getAccessToken: Effect.Effect<string, AccessTokenError>;
}

export class Auth extends Context.Tag("Auth")<Auth, AuthService>() {}

export const AuthLive = Layer.succeed(
  Auth,
  Auth.of({
    getAccessToken: Effect.tryPromise({
      try: async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("No access token available");
        }
        return accessToken;
      },
      catch: (error) =>
        new AccessTokenError({
          message:
            error instanceof Error
              ? error.message
              : "Failed to get access token",
          cause: error,
        }),
    }),
  }),
);
