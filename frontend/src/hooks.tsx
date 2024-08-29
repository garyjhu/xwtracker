import { useOutletContext } from "react-router-dom";
import { User } from "firebase/auth";

export function useUser() {
  return useOutletContext<User>()
}