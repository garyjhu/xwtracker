import { GetSolveDataListResponse, SolveTimesListItem, SortDirection, SortName } from "./types";
import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { User } from "firebase/auth";
import { format } from "date-fns";

export function getSolveTimesOptions(user: User, group: string) {
  return queryOptions({
    queryKey: ["getSolveTimes", user.uid, group],
    queryFn: () => getSolveTimes(user, group)
  })
}

export function getSolveDataOptions(user: User, id: number) {
  return queryOptions({
    queryKey: ["getSolveData", user.uid, id],
    queryFn: () => getSolveData(user, id)
  })
}

export function getSolveDataListOptions(
    user: User,
    page: number,
    pageSize: number,
    sortName: SortName = "date",
    sortDir: SortDirection = "desc"
) {
  return queryOptions({
    queryKey: ["getSolveDataList", user.uid, page, pageSize, sortName, sortDir],
    queryFn: () => getSolveDataList(user, page, pageSize, sortName, sortDir)
  })
}

export async function getSolveTimes(user: User, group: string) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<SolveTimesListItem[]>(`http://localhost:8080/api/solvetimes/group=${group}`, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function getSolveData(user: User, id: number) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<SolveTimesListItem[]>(`http://localhost:8080/api/solvedata/id=${id}`, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function getSolveDataList(
    user: User,
    page: number,
    pageSize: number,
    sortName: SortName,
    sortDir: SortDirection) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<GetSolveDataListResponse>(`http://localhost:8080/api/solvedata?page=${page}&size=${pageSize}&sort=${sortName},${sortDir}`, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function updateNytSolveData(user: User, startDate: Date, endDate: Date) {
  const idToken = await user.getIdToken(true)
  const startDateFormatted = format(startDate, "yyyy-MM-dd")
  const endDateFormatted = format(endDate, "yyyy-MM-dd")
  return await axios.post(`http://localhost:8080/nyt?dateStart=${startDateFormatted}&dateEnd=${endDateFormatted}`, null, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
}