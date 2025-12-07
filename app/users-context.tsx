"use client";

import {
  createContext,
  useContext,
  useOptimistic,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User } from "@/lib/api/schema";

export type OptimisticUser = User & { pending?: boolean };

type UsersContextType = {
  optimisticUsers: readonly OptimisticUser[];
  addOptimisticUser: (user: OptimisticUser) => void;
  setServerUsers: (users: readonly User[]) => void;
};

const UsersContext = createContext<UsersContextType | null>(null);

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}

type UsersProviderProps = {
  children: ReactNode;
};

export function UsersProvider({ children }: UsersProviderProps) {
  const [serverUsers, setServerUsers] = useState<readonly User[]>([]);
  
  const [optimisticUsers, addOptimisticUser] = useOptimistic<
    readonly OptimisticUser[],
    OptimisticUser
  >(serverUsers, (state, newUser) => [...state, newUser]);

  return (
    <UsersContext.Provider value={{ optimisticUsers, addOptimisticUser, setServerUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

// Component to sync server data with context
export function UsersSync({ users }: { users: readonly User[] }) {
  const { setServerUsers } = useUsers();
  
  useEffect(() => {
    setServerUsers(users);
  }, [users, setServerUsers]);
  
  return null;
}
