import { Box, Button, Center, useMantineTheme } from "@mantine/core";
import PuzzleGrid from "./PuzzleGrid";
import {SolveData} from "./types";
import styles from "./SolveDataListItem.module.css"
import { format, parse } from "date-fns";
import { isNyt } from "./predicates";
import { useNavigate } from "react-router-dom";

interface SolveDataListItemProps {
  solveData: SolveData;
}

function SolveDataListItem({ solveData }: SolveDataListItemProps) {
  const navigate = useNavigate()

  let title = solveData.puzzle.title
  if (isNyt(solveData.puzzle)) {
    const desc = `New York Times - ${format(parse(solveData.puzzle.nytPrintDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, y")}`
    if (!title) title = desc
    else title = `${title} (${desc})`
  }
  else if (!title) title = "Untitled Puzzle"

  const handleClick = () => {
    if (isNyt(solveData.puzzle)) {
      navigate(`/puzzle?date=${solveData.puzzle.nytPrintDate}`)
    }
    else {
      navigate(`/puzzle?id=${solveData.id}`)
    }
  }

  return (
    <Button className={styles.button} fullWidth onClick={handleClick}>
      <Center className={styles["box-puzzle"]} inline>
        <PuzzleGrid solveData={solveData}/>
      </Center>
      <Box className={styles["box-info"]}>
        <h1>{title}</h1>
        <h1>{new Date(solveData.time * 1000).toISOString().slice(11, 19)}</h1>
      </Box>
    </Button>
  )
}

export default SolveDataListItem