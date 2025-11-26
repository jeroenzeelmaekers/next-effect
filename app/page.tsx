import { getUsersSafe } from "@/lib/api/services";
import { Either, Match } from "effect";

export default async function Home() {
  const result = await getUsersSafe();

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
    <>
      <h1>NextJS + Effect</h1>
      <ul>
        {result.right.map((user) => (
          <li key={user.id}>
            {user.id}. {user.name} ({user.username}) - {user.email}
          </li>
        ))}
      </ul>
    </>
  );
}
