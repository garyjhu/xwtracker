import { Box, Button, Center } from "@mantine/core";
import PuzzleGrid from "./PuzzleGrid";
import {SolveData} from "./types";
import styles from "./SolveDataListItem.module.css"
import { format } from "date-fns";

interface SolveDataListItemProps {
  solveData: SolveData;
  key?: number;
}

function SolveDataListItem({ solveData, key }: SolveDataListItemProps) {
  let title = solveData.puzzle.title
  if (solveData.puzzle.nytId) {
    const desc = `New York Times - ${format(solveData.date, "EEEE, MMMM d, y")}`
    if (!title) title = desc
    else title = `${title} (${desc})`
  }
  else if (!title) title = "Untitled Puzzle"
  return (
    <Button className={styles.button} fullWidth key={key}>
      <Center className={styles["box-puzzle"]} inline>
        <PuzzleGrid solveData={solveData} />
      </Center>
      <Box className={styles["box-info"]}>
        <h1>{title}</h1>
        <h1>{new Date(solveData.time * 1000).toISOString().slice(11, 19)}</h1>
      </Box>
    </Button>
  )
}

export default SolveDataListItem