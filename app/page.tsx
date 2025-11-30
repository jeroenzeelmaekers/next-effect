import { getUsers } from "@/lib/api/services";
import { Either, Match } from "effect";
import { Suspense } from "react";
import { UsersList } from "./users-list";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <h1>NextJS + Effect</h1>
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
      <div>
        {Match.value(error).pipe(
          Match.tag("NetworkError", (e) => `Network error: ${e.message}`),
          Match.tag("UserNotFound", (e) => `User not found: ID ${e.userId}`),
          Match.tag("ValidationError", (e) => `Validation error: ${e.message}`),
          Match.orElse(() => `Something went wrong`),
        )}
      </div>
    ),
    onRight: (users) => <UsersList users={users} />,
  });
}
