import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import HeaderLink from "./HeaderLink";

export default function Header() {
  const { user, loading, logOut } = useContext(AuthContext)
  const navigate = useNavigate()
  if (loading) return null

  return (
    <Group justify={"flex-end"} h={"100%"} pr={"md"}>
      {user ? (
        <>
          <HeaderLink label={"Dashboard"} onClick={() => navigate("/")} />
          <HeaderLink label={"Profile"} onClick={() => navigate("/profile")} />
          <HeaderLink label={"Log Out"} onClick={logOut} />
        </>
      ) : (
        <>
          <HeaderLink label={"Log In"} onClick={() => navigate("/login")} />
          <HeaderLink label={"Sign Up"} onClick={() => navigate("/signup")} />
        </>
      )}
    </Group>
  )
}