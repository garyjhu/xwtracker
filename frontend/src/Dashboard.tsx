import { Pagination, Stack } from "@mantine/core";
import SolveDataListItem from "./SolveDataListItem";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSolveDataListOptions } from "./api";
import { AuthContext } from "./AuthProvider";

export interface DashboardState {
  page: number,
  pageSize: number
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    page: 1,
    pageSize: 10
  })
  const { user } = useContext(AuthContext)

  const solveDataListQuery = useQuery(getSolveDataListOptions(user!, state.page, state.pageSize))

  if (!solveDataListQuery.data) return null

  const { solveDataList, numberOfPages } = solveDataListQuery.data

  return (
    <>
      <Stack>
        {solveDataList.map((solveData) => <SolveDataListItem solveData={solveData} key={solveData.id} />)}
      </Stack>
      <Pagination total={numberOfPages} onChange={(page) => setState({...state, page})} />
    </>
  )
}