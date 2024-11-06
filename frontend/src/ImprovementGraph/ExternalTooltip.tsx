import { Box, Button, Center, LoadingOverlay } from "@mantine/core";
import styles from "./Tooltip.module.css"
import PuzzleGrid from "../PuzzleGrid";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveData } from "../api";
import { useAuthenticatedUser } from "../hooks";
import { getSolveTimeFormatted, getTitle } from "../tools";
import { TooltipState } from "./ImprovementGraph";

export default function ExternalTooltip({ solveDataId, style }: TooltipState) {
  const user = useAuthenticatedUser()
  const searchKey = { id: solveDataId }
  const { isPending, isError, data: solveData } = useQuery({
    queryKey: ["getSolveData", user.uid, searchKey],
    queryFn: () => fetchSolveData(user, searchKey),
  })

  return (
    <div className={styles["box-tooltip"]} id={"chartjs-tooltip"} style={style}>
      <Button className={styles.button} w={400}>
        {isPending || isError ? <LoadingOverlay /> : (
          <>
            <Center className={styles["box-puzzle"]}>
              {solveDataId && <PuzzleGrid searchKey={{ id: solveDataId }} solveData={solveData} />}
            </Center>
            <Box className={styles["box-info"]}>
              <h3>{getTitle(solveData)}</h3>
              <h3>{getSolveTimeFormatted(solveData)}</h3>
            </Box>
          </>
        )}
      </Button>
    </div>
  )
}