import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

export interface SolveData {
  id: number,
  title: string,
  cells: SolveDataCell[],
  height: number,
  width: number,
  secondsSpentSolving: number,
  checks: number,
  reveals: number,
  timeOfSolve: Date,
  group: string
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
  solveDataList: SolveData[],
  numberOfPages: number
}