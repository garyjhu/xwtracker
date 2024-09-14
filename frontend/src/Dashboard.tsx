import { Button, Group, Pagination, Stack } from "@mantine/core";
import SolveDataListItem from "./SolveDataListItem";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSolveDataListOptions } from "./api";
import { AuthContext } from "./AuthProvider";
import { useAuthenticatedUser } from "./hooks";

export interface DashboardState {
  page: number,
  pageSize: number
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    page: 0,
    pageSize: 10
  })
  const user = useAuthenticatedUser()

  const { isPending, isError, data, error, fetchStatus } = useQuery(getSolveDataListOptions(user, state.page, state.pageSize))

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  const { content, totalPages } = data

  return (
    <>
      <Stack>
        {content.map((solveData) => <SolveDataListItem solveData={solveData} key={solveData.id} />)}
      </Stack>
      <Pagination total={totalPages} onChange={(page) => setState({...state, page})} />
    </>
  )
}