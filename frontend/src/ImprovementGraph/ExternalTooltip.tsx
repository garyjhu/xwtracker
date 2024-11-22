import { AspectRatio, Box, Center, Loader, LoadingOverlay, MantineStyleProps, Stack, Text } from "@mantine/core";
import styles from "./Tooltip.module.css"
import PuzzleGrid from "../PuzzleGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveData } from "../api";
import { useAuthenticatedUser } from "../hooks";
import { formatSeconds } from "../tools";
import { TooltipState } from "./ImprovementGraph";
import dayjs from "dayjs";

type ExternalTooltipProps = TooltipState & { w: MantineStyleProps["w"] }

export default function ExternalTooltip({ solveDataSummary, style, w }: ExternalTooltipProps) {
  const user = useAuthenticatedUser()
  const searchKey = { id: solveDataSummary?.id }
  const { data: solveData } = useQuery({
    queryKey: ["getSolveData", user.uid, searchKey],
    queryFn: () => fetchSolveData(user, searchKey),
  })

  return (
    <Stack className={styles["box-tooltip"]} id={"chartjs-tooltip"} style={style} w={w} gap={0}>
      {solveDataSummary && (
        <Box p={2}>
          <Text fz={"xs"}>Solve Date: {dayjs(solveDataSummary.date).format("M/D/YYYY")}</Text>
          <Text fz={"xs"}>Solve Time: {formatSeconds(solveDataSummary.time)}</Text>
        </Box>
      )}
        <AspectRatio ratio={1} w={"100%"}>
          <Center>
            {solveData ? (
              <PuzzleGrid searchKey={{ id: solveData.id }} solveData={solveData} />
            ) : (
              <Loader color={"dark.8"} type={"bars"} />
            )}
          </Center>
        </AspectRatio>
    </Stack>
  )
}