import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "@mantine/core";
import { AuthContext } from "../../auth";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { loading, user } = useContext(AuthContext)

  if (loading) return <Loader type={"bars"} />

  if (!user) return <Navigate to={"/login"} />

  return children
}