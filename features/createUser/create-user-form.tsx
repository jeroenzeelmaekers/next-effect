"use client";

import { useActionState } from "react";
import { createUserAction, ActionState } from "./action";
import { OptimisticUser } from "@/app/users-list";
import { CreateUser } from "@/lib/api/schema";
import { Schema } from "effect";

type CreateUserFormProps = {
  addOptimisticUserAction: (user: OptimisticUser) => void;
};

const decodeCreateUser = Schema.decodeUnknownSync(CreateUser);

export default function CreateUserForm({
  addOptimisticUserAction,
}: CreateUserFormProps) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (_, formData) => {
      const data = decodeCreateUser(Object.fromEntries(formData));
      addOptimisticUserAction({
        id: 0,
        ...data,
        pending: true,
      });
      return createUserAction(formData);
    },
    null,
  );
  return (
    <form action={action}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="username" placeholder="Username" required />
      <button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create User"}
      </button>
      {state?.success === false && (
        <p style={{ color: "red" }}>Error: {state.error}</p>
      )}
      {state?.success && (
        <p style={{ color: "green" }}>Created: {state.user.name}</p>
      )}
    </form>
  );
}
