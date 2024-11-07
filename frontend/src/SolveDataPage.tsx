import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchSolveData, fetchSolveDataOptions } from "./api";
import { useAuthenticatedUser } from "./hooks";
import PuzzleGrid from "./PuzzleGrid";
import { ImprovementGraph } from "./ImprovementGraph";
import DistributionGraph from "./DistributionGraph/DistributionGraph";
import { AspectRatio, Box, Button, Center, Group, Stack } from "@mantine/core";
import { getTitle } from "./tools";
import { IconChevronLeft } from "@tabler/icons-react";

export default function SolveDataPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchKey = {
    id: searchParams.get("id") || undefined,
    puzzleId: searchParams.get("puzzle_id") || undefined,
    nytPrintDate: searchParams.get("nyt_print_date") || undefined
  }

  const user = useAuthenticatedUser()
  const { isPending, isError, data: solveData, error } = useQuery({
    queryKey: ["fetchSolveData", user.uid, searchKey],
    queryFn: async () => fetchSolveData(user, searchKey),
    placeholderData: keepPreviousData
  })

  return (
    <>
      <Group>
        <Button pl={"xs"} onClick={() => navigate("/")}>
          <IconChevronLeft />
          <span>Dashboard</span>
        </Button>
        <h1>{isError ? error.message : solveData && getTitle(solveData)}</h1>
      </Group>
      { solveData && (
        <Group>
          <AspectRatio ratio={1} flex={"4 1 0"}>
            <Center>
              <PuzzleGrid searchKey={searchKey} solveData={solveData} showAnswers />
            </Center>
          </AspectRatio>
          <Stack flex={"6 1 0"}>
            <ImprovementGraph solveGroup={solveData.defaultGroup.name} solveData={solveData} />
            <DistributionGraph solveGroup={solveData.defaultGroup.name} solveData={solveData} />
          </Stack>
        </Group>
      )}
    </>
  )
}