import { Pagination, Stack } from "@mantine/core";
import SolveDataListItem from "./SolveDataListItem";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSolveDataListOptions } from "./api";
import { useAuthenticatedUser } from "./hooks";
import { isNyt } from "./predicates";

export interface DashboardState {
  page: number,
  pageSize: number
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    page: 1,
    pageSize: 10
  })
  const user = useAuthenticatedUser()

  const queryClient = useQueryClient()
  const { isPending, isError, data, error, fetchStatus } = useQuery(getSolveDataListOptions(user, state.page - 1, state.pageSize))

  useEffect(() => {
    if (data) {
      for (let solveData of data.content) {
        queryClient.setQueryData(["getSolveData", user.uid, { solveDataId: solveData.id }], solveData)
        if (isNyt(solveData.puzzle)) {
          queryClient.setQueryData(["getSolveData", user.uid, { nytPrintDate: solveData.puzzle.nytPrintDate }], solveData)
        }
      }
    }
  }, [data, queryClient, user])

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
      <Pagination total={totalPages} value={state.page} onChange={(page) => setState({...state, page})} />
    </>
  )
}