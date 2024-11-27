import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuthenticatedUser() {
  const { user } = useContext(AuthContext)
  if (!user) throw new Error("Invalid state")
  return user
}