import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

export interface Puzzle {
  id: string
  title: string
}

export interface NytPuzzle extends Puzzle {
  nytId: number,
  svg: string,
  nytPrintDate: string
}

export interface SolveData {
  id: string,
  cells: SolveDataCell[],
  height: number,
  width: number,
  time: number,
  date: Date,
  defaultGroup: SolveGroup,
  groups: SolveGroup[],
  puzzle: Puzzle
}

export interface SolveDataCell {
  id: number,
  blank: boolean,
  guess: string
}

export interface SolveGroup {
  name: string,
  color: string
}

export type SolveDataSearchKey = {
  id?: string,
  puzzleId?: string,
  nytPrintDate?: string
}

export interface SolveDataSummary {
  id: string,
  time: number,
  date: Date
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