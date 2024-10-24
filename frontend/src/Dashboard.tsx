import { Pagination, Stack } from "@mantine/core";
import SolveDataListItem from "./SolveDataListItem";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSolveDataList } from "./api";
import { useAuthenticatedUser } from "./hooks";
import { isNyt } from "./predicates";
import { SortDirection, SortName } from "./types";
import SolveDataListOptions from "./SolveDataListOptions";

export interface DashboardState {
  page: number,
  pageSize: number,
  sortBy: SortName,
  sortDir: SortDirection
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    page: 1,
    pageSize: 10,
    sortBy: "date",
    sortDir: "desc"
  })
  const user = useAuthenticatedUser()

  const queryClient = useQueryClient()
  const { isPending, isError, data, error, fetchStatus } = useQuery({
    queryKey: ["getSolveDataList", user.uid, state.page - 1, state.pageSize, state.sortBy, state.sortDir],
    queryFn: async () => {
      const response = await getSolveDataList(user, state.page - 1, state.pageSize, state.sortBy, state.sortDir)
      response.content.forEach(solveData => {
        queryClient.setQueryData(["getSolveData", user.uid, { id: solveData.id }], solveData)
        queryClient.setQueryData(["getSolveData", user.uid, { puzzleId: solveData.puzzle.id }], solveData)
        if (isNyt(solveData.puzzle)) {
          queryClient.setQueryData(["getSolveData", user.uid, { nytPrintDate: solveData.puzzle.nytPrintDate }], solveData)
        }
      })
      return response
    }
  })

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  const { content, totalPages } = data

  return (
    <>
      <SolveDataListOptions state={state} handleChange={state => setState(state)} />
      <Stack>
        {content.map((solveData) => <SolveDataListItem solveData={solveData} key={solveData.id} />)}
      </Stack>
      <Pagination total={totalPages} value={state.page} onChange={(page) => setState({...state, page})} />
    </>
  )
}