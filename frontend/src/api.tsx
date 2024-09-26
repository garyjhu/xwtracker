import {
  GetSolveDataListResponse,
  SolveData,
  SolveDataSearchKey,
  SolveDataSummary,
  SortDirection,
  SortName
} from "./types";
import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { User } from "firebase/auth";
import { format } from "date-fns";

const BASE_URL = "http://localhost:8080"

export function getSolveDataSummaryListOptions(user: User, group: string) {
  return queryOptions({
    queryKey: ["getSolveDataSummaryList", user.uid, group],
    queryFn: () => getSolveDataSummaryList(user, group)
  })
}

export function getSolveDataOptions(user: User, key: SolveDataSearchKey) {
  return queryOptions({
    queryKey: ["getSolveData", user.uid, key],
    queryFn: () => getSolveData(user, key)
  })
}

export function getSolveDataListOptions(
    user: User,
    pageIndex: number,
    pageSize: number,
    sortName: SortName = "date",
    sortDir: SortDirection = "desc"
) {
  return queryOptions({
    queryKey: ["getSolveDataList", user.uid, pageIndex, pageSize, sortName, sortDir],
    queryFn: () => getSolveDataList(user, pageIndex, pageSize, sortName, sortDir)
  })
}

export async function getSolveDataSummaryList(user: User, group: string) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<SolveDataSummary[]>(`${BASE_URL}/solvedata?group=${group}`, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function getSolveData(user: User, key: SolveDataSearchKey) {
  const idToken = await user.getIdToken(true)
  let url
  if (key.id) {
    url = `${BASE_URL}/solvedata?id=${key.id}`
  }
  else if (key.puzzleId) {
    url = `${BASE_URL}/solvedata?puzzle_id=${key.puzzleId}`
  }
  else if (key.nytPrintDate) {
    url = `${BASE_URL}/nyt/solvedata?print_date=${key.nytPrintDate}`
  }
  else {
    throw new Error("Solve data not found")
  }
  const response = await axios.get<SolveData>(url, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function getSolveDataList(
    user: User,
    pageIndex: number,
    pageSize: number,
    sortName: SortName,
    sortDir: SortDirection) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<GetSolveDataListResponse>(`${BASE_URL}/solvedata?page=${pageIndex}&size=${pageSize}&sort=${sortName},${sortDir}`, {
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