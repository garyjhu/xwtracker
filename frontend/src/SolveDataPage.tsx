import {useQuery} from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom";
import { fetchSolveDataOptions } from "./api";
import { useAuthenticatedUser } from "./hooks";
import PuzzleGrid from "./PuzzleGrid";
import { ImprovementGraph } from "./ImprovementGraph";
import DistributionGraph from "./DistributionGraph/DistributionGraph";
import { AspectRatio, Center, Group, Stack } from "@mantine/core";

export default function SolveDataPage() {
  const [searchParams] = useSearchParams()
  const searchKey = {
    id: searchParams.get("id") || undefined,
    puzzleId: searchParams.get("puzzle_id") || undefined,
    nytPrintDate: searchParams.get("nyt_print_date") || undefined
  }

  const user = useAuthenticatedUser()
  const { isPending, isError, data: solveData, error, fetchStatus } = useQuery(fetchSolveDataOptions(user, searchKey))

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  return (
    <>
      <ImprovementGraph solveGroup={solveData.defaultGroup.name} solveData={solveData} />
      <DistributionGraph solveGroup={solveData.defaultGroup.name} solveData={solveData} />
      <PuzzleGrid searchKey={searchKey} solveData={solveData} showAnswers />
    </>
  )
}