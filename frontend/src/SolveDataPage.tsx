import { useQuery } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthenticatedUser } from "./hooks";
import PuzzleGrid from "./PuzzleGrid";
import { ImprovementGraph } from "./ImprovementGraph";
import DistributionGraph from "./DistributionGraph/DistributionGraph";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title
} from "@mantine/core";
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
  const { data: solveData, isFetching, isPlaceholderData, isError: isErrorData, error: errorData } = useQuery(solveDataOptions(user, searchKey, true))
  const { data: solveTimes, isError: isErrorSolveTimes, error: errorSolveTimes } = useQuery(solveTimesOptions(user, solveData?.defaultGroup.name))
  const { data: stats, isError: isErrorStats, error: errorStats } = useQuery(statsOptions(user, solveData?.defaultGroup.name, solveTimes))

  if (isErrorData && !isFetching) throw errorData
  if (isErrorSolveTimes) throw errorSolveTimes
  if (isErrorStats) throw errorStats

  if (!solveData || !solveTimes || !stats) return (
    <Center>
      <Loader type={"bars"} />
    </Center>
  )

  const { date, time, defaultGroup: { name: group } } = solveData
  const { median, min, percentile } = stats
  const color = time <= median ? "green.6" : "red.6"

  return (
    <Box pos={"relative"}>
      <LoadingOverlay visible={isPlaceholderData} loaderProps={{ type: "bars" }} />
      <Group>
        <Button pl={"xs"} onClick={() => navigate("/")}>
          <IconChevronLeft />
          <Text>Dashboard</Text>
        </Button>
        <Title>{getTitle(solveData)}</Title>
      </Group>
      <Group gap={"xs"} mt={"xs"} mb={"xs"}>
        <IconCalendarTime />
        <Text inline>{dayjs(date).format("dddd, MMMM D, YYYY h:ss A")}</Text>
      </Group>
      <Group align={"flex-start"}>
        <AspectRatio ratio={1} flex={"4"}>
          <PuzzleGrid searchKey={searchKey} showAnswers />
        </AspectRatio>
        <Stack flex={3}>
          <Box>
            <Stack align={"center"} gap={"xs"}>
              <Paper withBorder shadow={"xs"} p={"xs"} w={"100%"}>
                <Stack align={"center"} gap={"xs"}>
                  <Text size={"xl"}>Solve Time</Text>
                  <Text fz={72} inline>{formatSeconds(time)}</Text>
                </Stack>
              </Paper>
              <Group w={"100%"} gap={"xs"}>
                <Paper withBorder shadow={"xs"} p={"xs"} flex={1}>
                  <Stack align={"center"} gap={"xs"}>
                    <Text>Median</Text>
                    <Text fz={36} inline>{formatSeconds(median)}</Text>
                    <Text c={color} fz={24} inline>{formatDifference(time, median)}</Text>
                  </Stack>
                </Paper>
                <Paper withBorder shadow={"xs"} p={"xs"} flex={1}>
                  <Stack align={"center"} gap={"xs"}>
                    <Text>Best</Text>
                    <Text fz={36} inline>{formatSeconds(min)}</Text>
                    <Text c={"dimmed"} fz={24} inline>{formatDifference(time, min)}</Text>
                  </Stack>
                </Paper>
              </Group>
              <Paper withBorder shadow={"xs"} p={"md"} w={"100%"}>
                <Text>
                  You solved this puzzle faster than{" "}
                  <Text span c={color}>
                    {percentile(time)}%
                  </Text>
                  {" "}of {group} puzzles.
                </Text>
              </Paper>
            </Stack>
          </Box>
        </Stack>
        <Stack flex={"4"} miw={0}>
          <ImprovementGraph solveGroup={group} solveData={solveData} />
          <DistributionGraph solveGroup={group} solveData={solveData} />
        </Stack>
      </Group>
    </Box>
  )
}