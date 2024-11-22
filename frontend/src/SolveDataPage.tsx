import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchSolveData, fetchSolveDataSummaryList } from "./api";
import { useAuthenticatedUser } from "./hooks";
import PuzzleGrid from "./PuzzleGrid";
import { ImprovementGraph } from "./ImprovementGraph";
import DistributionGraph from "./DistributionGraph/DistributionGraph";
import { AspectRatio, Box, Button, Center, Container, Group, Paper, Stack, Text } from "@mantine/core";
import { formatDifference, formatSeconds, getTitle } from "./tools";
import { IconCalendarTime, IconChevronLeft } from "@tabler/icons-react";
import { solveDataOptions, solveTimesOptions, statsOptions } from "./query-options";
import dayjs from "dayjs";

export default function SolveDataPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchKey = {
    id: searchParams.get("id") || undefined,
    puzzleId: searchParams.get("puzzle_id") || undefined,
    nytPrintDate: searchParams.get("nyt_print_date") || undefined
  }

  const user = useAuthenticatedUser()
  const { data: solveData, isError, error } = useQuery(solveDataOptions(user, searchKey, true))
  const group = solveData?.defaultGroup.name
  const { data: solveTimes } = useQuery(solveTimesOptions(user, group))
  const { data: stats } = useQuery(statsOptions(user, group, solveTimes))

  return (
    <>
      <Group>
        <Button pl={"xs"} onClick={() => navigate("/")}>
          <IconChevronLeft />
          <Text>Dashboard</Text>
        </Button>
        <h1>{isError ? error.message : solveData && getTitle(solveData)}</h1>
      </Group>
      { solveData && (
        <>
          <Group gap={"xs"} mb={"xs"}>
            <IconCalendarTime />
            <Text inline>{dayjs(solveData.date).format("dddd, MMMM D, YYYY h:ss A")}</Text>
          </Group>
          <Group align={"flex-start"}>
            <AspectRatio ratio={1} flex={"4"}>
              <PuzzleGrid searchKey={searchKey} solveData={solveData} showAnswers />
            </AspectRatio>
            <Stack flex={3}>
              {stats && (
                <Box>
                  <Stack align={"center"} gap={"xs"}>
                    <Paper withBorder shadow={"xs"} p={"xs"} w={"100%"}>
                      <Stack align={"center"}>
                        <Text size={"xl"}>Solve Time</Text>
                        <Text fz={72} inline>{formatSeconds(solveData.time)}</Text>
                      </Stack>
                    </Paper>
                    <Group w={"100%"} gap={"xs"}>
                      <Paper withBorder shadow={"xs"} p={"xs"} flex={1}>
                        <Stack align={"center"}>
                          <Text>Median</Text>
                          <Text fz={36} inline>{formatSeconds(stats.median)}</Text>
                          <Text fz={24} inline>{formatDifference(solveData.time, stats.median)}</Text>
                        </Stack>
                      </Paper>
                      <Paper withBorder shadow={"xs"} p={"xs"} flex={1}>
                        <Stack align={"center"}>
                          <Text>Best</Text>
                          <Text fz={36} inline>{formatSeconds(stats.min)}</Text>
                          <Text c={"dimmed"} fz={24} inline>{formatDifference(solveData.time, stats.min)}</Text>
                        </Stack>
                      </Paper>
                    </Group>
                    <Paper withBorder shadow={"xs"} p={"md"} w={"100%"}>
                      <Text>
                        You solved this puzzle faster than {stats.percentile(solveData.time)}% of {solveData.defaultGroup.name} puzzles.
                      </Text>
                    </Paper>
                  </Stack>
                </Box>
              )}
            </Stack>
            <Stack flex={"4"} miw={0}>
              <ImprovementGraph solveGroup={solveData.defaultGroup.name} solveData={solveData} />
              <DistributionGraph solveGroup={solveData.defaultGroup.name} solveData={solveData} />
            </Stack>
          </Group>
        </>
      )}
    </>
  )
}