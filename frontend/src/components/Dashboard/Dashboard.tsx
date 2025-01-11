import {
  Alert,
  Box,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Pagination,
  Stack
} from "@mantine/core";
import SolveDataListItem from "./SolveDataListItem";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSolveDataList, fetchSolveGroups } from "../../services/backend";
import { useAuthenticatedUser } from "../../auth";
import { isNyt } from "../../utils/predicates";
import { SortDirection, SortName } from "../../utils/types";
import SortOptions from "./SortOptions";
import GroupSelect from "./GroupSelect";
import Calendar from "./Calendar";
import PaginationOptions from "./PaginationOptions";
import { IconAlertTriangle } from "@tabler/icons-react";

export interface DashboardState {
  page: number,
  pageSize: number,
  sortBy: SortName,
  sortDir: SortDirection,
  selectedGroups: Set<string>
  dateStart?: Date,
  dateEnd?: Date
}

export type DashboardStateEventHandler = (partialState: Partial<DashboardState>) => void

export function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    page: 1,
    pageSize: 10,
    sortBy: "date",
    sortDir: "desc",
    selectedGroups: new Set<string>()
  })
  const user = useAuthenticatedUser()

  const { data: allGroups, isError: isErrorGroups } = useQuery({
    queryKey: ["fetchGroupNames", user.uid],
    queryFn: async () => fetchSolveGroups(user),
  })

  useEffect(() => {
    if (allGroups) {
      setState(state => ({ ...state, selectedGroups: new Set<string>(allGroups.map(group => group.name))} ))
    }
  }, [allGroups]);

  const queryClient = useQueryClient()

  const { data, isError: isErrorData, isPlaceholderData } = useQuery({
    queryKey: ["getSolveDataList", user.uid, { ...state, selectedGroups: undefined }, [...state.selectedGroups]],
    queryFn: async () => {
      const response = await fetchSolveDataList(user, state.page - 1, state.pageSize, state.sortBy, state.sortDir, state.selectedGroups, state.dateStart, state.dateEnd)
      response.content.forEach(solveData => {
        queryClient.setQueryData(["getSolveData", user.uid, { puzzleId: solveData.puzzle.id }], solveData)
        if (isNyt(solveData.puzzle)) {
          queryClient.setQueryData(["getSolveData", user.uid, { nytPrintDate: solveData.puzzle.nytPrintDate }], solveData)
        }
      })
      return response
    },
    placeholderData: keepPreviousData
  })

  const isError = isErrorGroups || isErrorData
  const errorRefreshingMsg = "An error occurred while refreshing the data. The data currently displayed may be outdated. Please refresh the page."
  const errorFetchingMsg = "An error occurred while fetching data. Please refresh the page."

  const handleChange = (partialState: Partial<DashboardState>) => setState({ ...state, ...partialState })

  return (
    <Stack>
      <Container>
        <Calendar {...state} onChange={handleChange} />
      </Container>
      <Group justify={"space-between"}>
        <GroupSelect {...state} allGroups={allGroups ?? []} onChange={handleChange} />
        <SortOptions {...state} onChange={handleChange} />
      </Group>
      <Box pos={"relative"}>
        <LoadingOverlay visible={isPlaceholderData} loaderProps={{ type: "bars" }}/>
        {isError && (
          <Alert
            variant={"light"}
            color={"red.8"}
            radius={"md"}
            icon={<IconAlertTriangle />}
            title={data ? errorRefreshingMsg : errorFetchingMsg}
            styles={{
              root: {
                boxShadow: "var(--mantine-shadow-xs)"
              },
              title: {
                fontSize: "var(--mantine-font-size-md)",
              }
            }}
          >
          </Alert>
        )}
        {data && (data.content.length === 0 ? (
          <Center>
            <span>No search results found.</span>
          </Center>
        ) : (
          <Stack>
            {data.content.map((solveData) => <SolveDataListItem solveData={solveData} key={solveData.puzzle.id} />)}
          </Stack>
        ))}
      </Box>
      <Group justify={"space-between"}>
        <PaginationOptions {...state} onChange={handleChange} />
        {data && <Pagination total={data.page.totalPages} value={state.page} onChange={(page) => setState({...state, page})} />}
      </Group>
    </Stack>
  )
}