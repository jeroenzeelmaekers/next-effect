"use server";

import { Match } from "effect";
import { revalidatePath } from "next/cache";
import { createUser } from "@/lib/api/services";

export type ActionState =
  | { success: true; user: { id: number; name: string; email: string } }
  | { success: false; error: string }
  | null;

const matchError = Match.type<{ _tag: string }>().pipe(
  Match.tag("NetworkError", () => "Unable to connect. Please try again later."),
  Match.tag("ValidationError", () => "Invalid response from server."),
  Match.orElse(() => "An unexpected error occurred."),
);

export async function createUserAction(
  formData: FormData,
): Promise<ActionState> {
  const data = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
  };

  const result = await createUser(data);

  if (result._tag === "Left") {
    return { success: false, error: matchError(result.left) };
  }

  revalidatePath("/");

  return { success: true, user: { ...result.right } };
}
