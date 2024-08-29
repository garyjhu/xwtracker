import { GetSolveDataListResponse, SolveTimesListItem } from "./types";
import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { User } from "firebase/auth";
import { format } from "date-fns";

export function getSolveTimesOptions(user: User, group: string) {
  return queryOptions({
    queryKey: ["getSolveTimes", user, group],
    queryFn: () => getSolveTimes(user, group)
  })
}

export function getSolveDataOptions(user: User, id: number) {
  return queryOptions({
    queryKey: ["getSolveData", user, id],
    queryFn: () => getSolveData(user, id)
  })
}

export function getSolveDataListOptions(user: User, page: number, pageSize: number) {
  return queryOptions({
    queryKey: ["getSolveDataList", user, page, pageSize],
    queryFn: () => getSolveDataList(user, page, pageSize)
  })
}

export async function getSolveTimes(user: User, group: string) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<SolveTimesListItem[]>(`https://localhost:8080/api/solvetimes/group=${group}`, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function getSolveData(user: User, id: number) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<SolveTimesListItem[]>(`https://localhost:8080/api/solvedata/id=${id}`, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function getSolveDataList(user: User, page: number, pageSize: number) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<GetSolveDataListResponse>(`https://localhost:8080/api/solvedata/page=${page}&size=${pageSize}`, {
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
  return await axios.put(`http://localhost:8080/api/nyt?startDate=${startDateFormatted}&endDate=${endDateFormatted}`, null, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
}