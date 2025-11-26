import { Schema } from "effect";

export class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String,
  username: Schema.String,
  email: Schema.String,
}) {}

export class Post extends Schema.Class<Post>("Post")({
  userId: Schema.Number,
  id: Schema.Number,
  title: Schema.String,
  body: Schema.String,
}) {}
