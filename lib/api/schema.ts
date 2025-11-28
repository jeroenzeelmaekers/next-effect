import { Schema } from "effect";

export class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String,
  username: Schema.String,
  email: Schema.String,
}) {}

export const CreateUser = Schema.Struct({
  name: Schema.String,
  username: Schema.String,
  email: Schema.String,
});
