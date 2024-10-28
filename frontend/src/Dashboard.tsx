import { Pagination, Stack } from "@mantine/core";
import SolveDataListItem from "./SolveDataListItem";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSolveDataList, fetchSolveGroups } from "./api";
import { useAuthenticatedUser } from "./hooks";
import { isNyt } from "./predicates";
import { SortDirection, SortName } from "./types";
import SolveDataListOptions from "./SolveDataListOptions";
import { getSelectedGroups } from "./tools";
import GroupSelect from "./GroupSelect";

export interface DashboardState {
  page: number,
  pageSize: number,
  sortBy: SortName,
  sortDir: SortDirection,
  selectedGroups: Set<string>
}

export type DashboardStateEventHandler = (partialState: Partial<DashboardState>) => void

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    page: 1,
    pageSize: 10,
    sortBy: "date",
    sortDir: "desc",
    selectedGroups: new Set<string>()
  })
  const user = useAuthenticatedUser()

  const { isPending: isPendingG, isError: isErrorG, data: allGroups, error: errorG, fetchStatus: fetchStatusG } = useQuery({
    queryKey: ["fetchGroupNames", user.uid],
    queryFn: async () => fetchSolveGroups(user)
  })

  useEffect(() => {
    if (allGroups) {
      setState(state => ({ ...state, selectedGroups: new Set<string>(allGroups.map(group => group.name))} ))
    }
  }, [allGroups]);

  const queryClient = useQueryClient()

  const { isPending, isError, data, error, fetchStatus } = useQuery({
    queryKey: ["getSolveDataList", user.uid, state.page - 1, state.pageSize, state.sortBy, state.sortDir, [...state.selectedGroups]],
    queryFn: async () => {
      const response = await fetchSolveDataList(user, state.page - 1, state.pageSize, state.sortBy, state.sortDir, [...state.selectedGroups])
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

  if (isPending || isPendingG) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>
  else if (isErrorG) return <span>Error: {errorG.message}</span>

  const { content, totalPages } = data

  const handleChange = (partialState: Partial<DashboardState>) => setState({ ...state, ...partialState })

  return (
    <>
      <GroupSelect {...state} allGroups={allGroups} onChange={handleChange} />
      <SolveDataListOptions {...state} onChange={handleChange} />
      <Stack>
        {content.map((solveData) => <SolveDataListItem solveData={solveData} key={solveData.id} />)}
      </Stack>
      <Pagination total={totalPages} value={state.page} onChange={(page) => setState({...state, page})} />
    </>
  )
}