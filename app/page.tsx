import { getUsers } from "@/lib/api/services";
import { Either, Match } from "effect";
import { Suspense } from "react";
import { UsersList } from "./users-list";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <h1>Users</h1>
      <Suspense fallback={<div>Loading users...</div>}>
        <UserListContainer />
      </Suspense>
    </>
  );
}

async function UserListContainer() {
  const result = await getUsers();

  return Either.match(result, {
    onLeft: (error) => (
      <span id="error-container" className="text-red-500 text-sm">
        {Match.value(error).pipe(
          Match.tag("NetworkError", (e) => `Network error: ${e.message}`),
          Match.tag("UserNotFound", (e) => `User not found: ID ${e.userId}`),
          Match.tag("ValidationError", (e) => `Validation error: ${e.message}`),
          Match.tag("AuthError", (e) => `Authentication error: ${e.message}`),
          Match.orElse(() => `Something went wrong`),
        )}
      </span>
    ),
    onRight: (users) => <UsersList users={users} />,
  });
}
