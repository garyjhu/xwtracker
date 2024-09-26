import {useQuery} from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom";
import { getSolveDataOptions } from "./api";
import { useAuthenticatedUser } from "./hooks";
import PuzzleGrid from "./PuzzleGrid";
import ImprovementGraph from "./ImprovementGraph";

export default function SolveDataPage() {
  const [searchParams] = useSearchParams()
  const searchKey = {
    puzzleId: searchParams.get("id") || undefined,
    nytPrintDate: searchParams.get("date") || undefined
  }

  const user = useAuthenticatedUser()
  const { isPending, isError, data: solveData, error, fetchStatus } = useQuery(getSolveDataOptions(user, searchKey))

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  return (
    <>
      <ImprovementGraph solveGroup={solveData.defaultGroup.name} solveData={solveData} />
      <PuzzleGrid searchKey={searchKey} solveData={solveData} showAnswers />
    </>
  )
}