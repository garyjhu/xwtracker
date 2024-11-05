import { Outlet } from "react-router-dom"
import AuthProvider from "./AuthProvider";
import { AppShell } from "@mantine/core";

export default function Root() {
  return (
    <AuthProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: "sm" }}
        footer={{ height: 30 }}
        padding={"md"}
      >
        <AppShell.Header>

        </AppShell.Header>
        <AppShell.Navbar>

        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        <AppShell.Footer>

        </AppShell.Footer>
      </AppShell>
    </AuthProvider>
  )
}