import { Result } from "@effect-atom/atom-react";
import { getUsers } from "@/lib/api/services";
import { UsersSync } from "./users-context";
import { UsersListClient } from "./users-list-client";

export async function UserListHandler() {
  const result = await getUsers();

  return Result.builder(result)
    .onErrorTag("NetworkError", (e) => <ErrorContainer message={e.message} />)
    .onErrorTag("UserNotFound", (e) => <ErrorContainer message={e.message} />)
    .onErrorTag("ValidationError", (e) => (
      <ErrorContainer message={e.message} />
    ))
    .onDefect(() => <ErrorContainer message="Something went wrong" />)
    .onSuccess((users) => (
      <>
        <UsersSync users={users} />
        <UsersListClient />
      </>
    ))
    .render();
}

function ErrorContainer({ message }: { message: string }) {
  return (
    <span id="error-container" className="text-red-500 text-sm">
      {message}
    </span>
  );
}
