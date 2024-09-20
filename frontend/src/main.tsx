import '@mantine/core/styles.css';
import React from "react"
import ReactDOM from "react-dom/client"
import Root from "./Root"
import { createTheme, MantineProvider } from "@mantine/core"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Login from "./Login"
import Signup from "./Signup"
import Dashboard from "./Dashboard"
import PrivateRoute from "./PrivateRoute";
import Profile from "./Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SolveDataPage from "./SolveDataPage";
import ErrorPage from "./ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
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
      }
    ]
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000
    }
  }
})

const theme = createTheme({
  autoContrast: true,
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
