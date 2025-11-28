"use client";

import { useActionState } from "react";
import { createUserAction, ActionState } from "./action";

export function CreateUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createUserAction,
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
