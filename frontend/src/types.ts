import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

export interface Puzzle {
  title: string
}

export interface NytPuzzle extends Puzzle {
  nytId: number,
  svg: string,
  nytPrintDate: string
}

export interface SolveData {
  id: number,
  cells: SolveDataCell[],
  height: number,
  width: number,
  time: number,
  date: Date,
  defaultGroup: { name: string },
  groups: { name: string }[]
  puzzle: Puzzle
}

export interface SolveDataCell {
  id: number,
  blank: boolean,
  guess: string
}

export type SolveDataSearchKeyType = "solveDataId" | "nytPrintDate"

export type SolveDataSearchKey = Exclude<{ [K in SolveDataSearchKeyType]?: string }, { [K in SolveDataSearchKeyType]: unknown }>

export interface SolveDataSummary {
  id: number,
  title: string,
  time: number,
  date: Date
}

export interface GraphProps {
  solveTimesList: SolveDataSummary[],
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