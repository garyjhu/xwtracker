import { Outlet } from "react-router-dom"
import AuthProvider from "./AuthProvider";

export default function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}