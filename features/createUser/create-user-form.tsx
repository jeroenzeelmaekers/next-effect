"use client";

import { useActionState } from "react";
import { createUserAction, ActionState as ServerActionState } from "./action";
import { useUsers } from "@/app/users-context";
import { z } from "zod";

const createUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.email("Invalid email format"),
});

type FieldErrors = z.ZodFlattenedError<
  z.infer<typeof createUserValidation>
>["fieldErrors"];

type ActionState =
  | ServerActionState
  | { success: false; fieldErrors: FieldErrors };

export default function CreateUserForm() {
  const { addOptimisticUser } = useUsers();

  const [state, action, pending] = useActionState<ActionState, FormData>(
    async (_, formData) => {
      const rawData = {
        name: formData.get("name") as string,
        username: formData.get("username") as string,
        email: formData.get("email") as string,
      };

      const validated = createUserValidation.safeParse(rawData);

      if (!validated.success) {
        return {
          success: false,
          fieldErrors: z.flattenError(validated.error).fieldErrors,
        };
      }

      addOptimisticUser({
        id: 0,
        ...validated.data,
        pending: true,
      });

      return createUserAction(formData);
    },
    null,
  );

  const fieldErrors =
    state?.success === false && "fieldErrors" in state
      ? state.fieldErrors
      : null;
  const serverError =
    state?.success === false && "error" in state ? state.error : null;

  return (
    <form action={action} noValidate>
      <div>
        <input name="name" placeholder="Name" required />
        {fieldErrors?.name && (
          <p style={{ color: "red" }}>{fieldErrors.name[0]}</p>
        )}
      </div>
      <div>
        <input name="email" type="email" placeholder="Email" required />
        {fieldErrors?.email && (
          <p style={{ color: "red" }}>{fieldErrors.email[0]}</p>
        )}
      </div>
      <div>
        <input name="username" placeholder="Username" required />
        {fieldErrors?.username && (
          <p style={{ color: "red" }}>{fieldErrors.username[0]}</p>
        )}
      </div>
      <button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create User"}
      </button>
      {serverError && <p style={{ color: "red" }}>Error: {serverError}</p>}
      {state?.success && (
        <p style={{ color: "green" }}>
          Created: name: {state.user.name} - username: {state.user.username} -{" "}
          email: {state.user.email}
        </p>
      )}
    </form>
  );
}
