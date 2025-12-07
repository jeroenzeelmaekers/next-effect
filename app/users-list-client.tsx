"use client";

import clsx from "clsx";
import { useUsers, OptimisticUser } from "./users-context";

export function UsersListClient() {
  const { optimisticUsers } = useUsers();

  return (
    <ul>
      {optimisticUsers.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
}

function UserListItem({ user }: { user: OptimisticUser }) {
  const isPending = (user: OptimisticUser) => user.pending === true;

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
