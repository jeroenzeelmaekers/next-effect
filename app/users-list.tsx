"use client";

import { useOptimistic } from "react";
import CreateUserForm from "../features/createUser/create-user-form";
import { User } from "@/lib/api/schema";
import clsx from "clsx";

export type OptimisticUser = User & { pending?: boolean };

export function UsersList({ users }: { users: readonly User[] }) {
  const [optimisticUsers, addOptimisticUser] = useOptimistic<
    readonly User[],
    OptimisticUser
  >(users, (state, newUser) => [...state, newUser]);

  return (
    <>
      <ul>
        {optimisticUsers.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </ul>
      <CreateUserForm addOptimisticUserAction={addOptimisticUser} />
    </>
  );
}

function UserListItem({ user }: { user: OptimisticUser }) {
  const isPending = (user: User | OptimisticUser): user is OptimisticUser =>
    "pending" in user && user.pending === true;

  return (
    <li
      key={user.id}
      className={clsx({
        "opacity-50": isPending(user),
      })}
    >
      {user.id > 0 ? `${user.id}. ` : ""}
      {user.name} ({user.username}) - {user.email}
      {isPending(user) && " (saving...)"}
    </li>
  );
}
