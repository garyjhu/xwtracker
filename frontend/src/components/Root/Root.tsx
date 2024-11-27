import { Outlet } from "react-router-dom"
import { AuthProvider } from "../auth/AuthProvider";
import { AppShell } from "@mantine/core";
import Header from "../Header/Header";

export function Root() {
  return (
    <AuthProvider>
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 30 }}
        padding={"md"}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        <AppShell.Footer>

        </AppShell.Footer>
      </AppShell>
    </AuthProvider>
  )
}