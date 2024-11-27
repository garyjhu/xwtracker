import { AspectRatio, Box, Center, MantineStyleProps, Stack, Text } from "@mantine/core";
import styles from "./Tooltip.module.css"
import { PuzzleGrid } from "../PuzzleGrid";
import { formatSeconds } from "../../utils/tools";
import { TooltipState } from "./ImprovementGraph";
import dayjs from "dayjs";

type ExternalTooltipProps = TooltipState & { w: MantineStyleProps["w"] }

export default function ExternalTooltip({ solveDataSummary, style, w }: ExternalTooltipProps) {
  return (
    <Stack className={styles["box-tooltip"]} id={"chartjs-tooltip"} style={style} w={w} gap={0}>
      {solveDataSummary && (
        <>
          <Box p={2}>
            <Text fz={"xs"}>Solve Date: {dayjs(solveDataSummary.date).format("M/D/YYYY")}</Text>
            <Text fz={"xs"}>Solve Time: {formatSeconds(solveDataSummary.time)}</Text>
          </Box>
          <AspectRatio ratio={1} w={"100%"}>
            <Center>
              <PuzzleGrid searchKey={{ puzzleId: solveDataSummary.puzzle.id }} />
            </Center>
          </AspectRatio>
        </>
      )}
    </Stack>
  )
}