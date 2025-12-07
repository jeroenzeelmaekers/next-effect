"use server";

import { Result } from "@effect-atom/atom-react";
import { revalidatePath } from "next/cache";
import { createUser } from "@/lib/api/services";

export type ActionState =
  | {
      success: true;
      user: { id: number; name: string; username: string; email: string };
    }
  | { success: false; error: string }
  | null;

export async function createUserAction(
  formData: FormData,
): Promise<ActionState> {
  const data = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
  };

  const result = await createUser(data);

  return Result.builder(result)
    .onErrorTag("NetworkError", () => ({
      success: false as const,
      error: "Unable to connect. Please try again later.",
    }))
    .onErrorTag("ValidationError", () => ({
      success: false as const,
      error: "Invalid response from server.",
    }))
    .onDefect(() => ({
      success: false as const,
      error: "An unexpected error occurred.",
    }))
    .onSuccess((user) => {
      revalidatePath("/");
      return { success: true as const, user: { ...user } };
    })
    .orElse(() => ({
      success: false as const,
      error: "An unexpected error occurred.",
    }));
}
