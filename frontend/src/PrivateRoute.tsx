import { ReactNode, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { loading, user } = useContext(AuthContext)

  if (loading) return null

  if (user) return children

  return <Navigate to={"/login"} />
}