import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

export interface SolveData {
  id: number,
  cells: SolveDataCell[],
  height: number,
  width: number,
  time: number,
  checks: number,
  reveals: number,
  date: Date,
  group: string
  puzzle: {
    nytId?: number
    svg: string
    title?: string
  }
}

export interface SolveDataCell {
  id: number,
  blank: boolean,
  guess: string
}

export interface SolveTimesListItem {
  solveDataId: number,
  solveTime: number,
  solveDate: Date
}

export interface GraphProps {
  solveTimesList: SolveTimesListItem[],
  solveData?: SolveData
}

export interface AuthContextValues {
  user: User | null,
  loading: boolean,
  createUser: (email: string, password: string) => ReturnType<typeof createUserWithEmailAndPassword>,
  logIn: (email: string, password: string) => ReturnType<typeof signInWithEmailAndPassword>,
  logOut: () => ReturnType<typeof signOut>
}

export interface GetSolveDataListResponse {
  content: SolveData[],
  last: boolean,
  totalPages: number,
  totalElements: number,
  first: boolean,
  size: number,
  "number": number
}

export type SortName = "date" | "time"

export type SortDirection = "asc" | "desc"