import {
  GetSolveDataListResponse,
  SolveData,
  SolveDataSearchKey,
  SolveDataSummary,
  SolveGroup,
  SortDirection,
  SortName
} from "./types";
import axios from "axios";
import { User } from "firebase/auth";
import { format } from "date-fns";

const BASE_URL = "http://localhost:8080"

export async function fetchSolveData(user: User, key: SolveDataSearchKey) {
  const idToken = await user.getIdToken(true)
  let url
  if (key.puzzleId) {
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

export async function fetchSolveDataList(
    user: User,
    pageIndex: number,
    pageSize: number,
    sortName: SortName,
    sortDir: SortDirection,
    groups: Iterable<string>,
    dateStart?: Date,
    dateEnd?: Date
) {
  const idToken = await user.getIdToken(true)
  const params: string[] = [`page=${pageIndex}`, `size=${pageSize}`, `sort=${sortName},${sortDir}`]
  for (const groupName of groups) params.push(`group=${groupName}`)
  if (dateStart) params.push(`date_start=${dateStart.toISOString()}`)
  if (dateEnd) params.push(`date_end=${dateEnd.toISOString()}`)
  const url = `${BASE_URL}/solvedata?${params.join("&")}`
  const response = await axios.get<GetSolveDataListResponse>(url, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function fetchSolveDataSummaryList(
  user: User,
  sortName: SortName,
  sortDir: SortDirection,
  groups: Iterable<string>
) {
  const idToken = await user.getIdToken(true)
  const params: string[] = [`sort=${sortName},${sortDir}`]
  for (const groupName of groups) params.push(`group=${groupName}`)
  const url = `${BASE_URL}/solvedata/summary?${params.join("&")}`
  const response = await axios.get<SolveDataSummary[]>(url, {
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
  return await axios.post(`${BASE_URL}/nyt?dateStart=${startDateFormatted}&dateEnd=${endDateFormatted}`, null, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
}

export async function fetchSolveGroups(user: User) {
  const idToken = await user.getIdToken(true)
  const response = await axios.get<SolveGroup[]>(`${BASE_URL}/user/groups`, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
  return response.data
}

export async function setCookie(user: User, cookie: string) {
  const idToken = await user.getIdToken(true)
  return await axios.put("http://localhost:8080/user/cookie", cookie, {
    headers: {
      Authorization: "bearer " + idToken,
      "Content-Type": "application/json"
    }
  })
}

export async function deleteSolveData(user: User, key: SolveDataSearchKey) {
  const idToken = await user.getIdToken(true)
  let url
  if (key.puzzleId) {
    url = `${BASE_URL}/solvedata?puzzle_id=${key.puzzleId}`
  }
  else if (key.nytPrintDate) {
    url = `${BASE_URL}/nyt/solvedata?print_date=${key.nytPrintDate}`
  }
  else {
    throw new Error("Solve data not found")
  }
  return await axios.delete<SolveData>(url, {
    headers: {
      Authorization: "bearer " + idToken
    }
  })
}