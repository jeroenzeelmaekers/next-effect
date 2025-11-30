import { Schema } from "effect";

export const User = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  username: Schema.String,
  email: Schema.String,
});

export type User = typeof User.Type;

export const CreateUser = Schema.Struct({
  name: Schema.String,
  username: Schema.String,
  email: Schema.String,
});

export type CreateUser = typeof CreateUser.Type;
