import {useQuery} from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom";
import { getSolveDataOptions } from "./api";
import { useAuthenticatedUser } from "./hooks";
import PuzzleGrid from "./PuzzleGrid";

export default function SolveDataPage() {
  const [searchParams] = useSearchParams()
  const searchKey = {
    solveDataId: searchParams.get("id") || undefined,
    nytPrintDate: searchParams.get("date") || undefined
  }
  if (!searchKey.solveDataId && !searchKey.nytPrintDate) {
    throw new Error("Solve data not found.")
  }

  const user = useAuthenticatedUser()
  const { isPending, isError, data: solveData, error, fetchStatus } = useQuery(getSolveDataOptions(user, searchKey))

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  return (
    <PuzzleGrid solveData={solveData} showAnswers />
  )
}