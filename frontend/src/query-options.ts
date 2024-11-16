import { User } from "firebase/auth";
import { keepPreviousData, queryOptions, skipToken } from "@tanstack/react-query";
import { fetchSolveData, fetchSolveDataSummaryList } from "./api";
import { getStats } from "./stats/get-stats";
import { SolveDataSearchKey } from "./types";

export function solveTimesOptions(user: User, group?: string) {
  return queryOptions({
    queryKey: ["fetchSolveTimes", user.uid, group],
    queryFn: group ? async () => {
      const solveDataSummaryList = await fetchSolveDataSummaryList(user, "time", "asc", [group])
      return solveDataSummaryList.map(summary => summary.time)
    } : skipToken
  })
}

export function statsOptions(user: User, solveGroup?: string, solveTimes?: number[]) {
  return queryOptions({
    queryKey: ["getStats", user.uid, solveGroup],
    queryFn: solveGroup && solveTimes ? () => getStats(solveTimes) : skipToken
  })
}

export function fetchSolveDataSummaryListOptions(user: User, groups: Iterable<string>) {
  return queryOptions({
    queryKey: ["fetchSolveDataSummaryList", user.uid, [...groups]],
    queryFn: () => fetchSolveDataSummaryList(user, "date", "asc", groups)
  })
}

export function solveDataOptions(user: User, key: SolveDataSearchKey, placeholder?: boolean) {
  return queryOptions({
    queryKey: ["fetchSolveData", user.uid, key],
    queryFn: () => fetchSolveData(user, key),
    placeholderData: placeholder ? keepPreviousData : undefined
  })
}