import { getUsers } from "@/lib/api/services";
import { Either, Match } from "effect";
import { Suspense } from "react";
import { CreateUserForm } from "./createUser/page";

export default function Home() {
  return (
    <>
      <h1>NextJS + Effect</h1>
      <Suspense fallback={<div>Loading users...</div>}>
        <UserList />
      </Suspense>
      <CreateUserForm />
    </>
  );
}

async function UserList() {
  const result = await getUsers();

  if (Either.isLeft(result)) {
    const errorMessage = Match.value(result.left).pipe(
      Match.tag("NetworkError", (e) => `Network error: ${e.message}`),
      Match.tag("UserNotFound", (e) => `User not found: ID ${e.userId}`),
      Match.tag("ValidationError", (e) => `Validation error: ${e.message}`),
      Match.exhaustive,
    );
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <ul>
      {result.right.map((user) => (
        <li key={user.id}>
          {user.id}. {user.name} ({user.username}) - {user.email}
        </li>
      ))}
    </ul>
  );
}
