import { Suspense } from "react";
import { UserListHandler } from "./users-list-handler";
import { UsersProvider } from "./users-context";
import CreateUserForm from "@/features/createUser/create-user-form";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <h1>Users</h1>
      <UsersProvider>
        <Suspense fallback={<span id="loading">Loading users...</span>}>
          <UserListHandler />
        </Suspense>
        <CreateUserForm />
      </UsersProvider>
    </>
  );
}
