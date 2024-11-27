import React from "react"
import ReactDOM from "react-dom/client"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import { createTheme, MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { SolveDataPage } from "./components/SolveDataPage";
import { ForgotPassword, Login, Signup } from "./components/login";
import { ErrorPage } from "./components/ErrorPage";
import { Root } from "./components/Root"
import { Dashboard } from "./components/Dashboard"
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { Profile } from "./components/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        )
      },
      {
        path: "/puzzle",
        element: (
          <PrivateRoute>
            <SolveDataPage />
          </PrivateRoute>
        )
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/forgot_password",
        element: <ForgotPassword />
      }
    ]
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
})

const theme = createTheme({
  autoContrast: true,
  fontFamily: "Roboto",
  primaryColor: "aquamarine",
  primaryShade: 2,
  colors: {
    "aquamarine": [
      "#e1fff6",
      "#cbffee",
      "#9affde",
      "#64ffcb",
      "#3bffbb",
      "#21ffb1",
      "#09ffac",
      "#00e396",
      "#00ca84",
      "#00ae70"
    ]
  }
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>,
)
