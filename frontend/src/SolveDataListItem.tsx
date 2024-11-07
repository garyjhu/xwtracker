import { Box, Button, Center, Pill, PillGroup } from "@mantine/core";
import PuzzleGrid from "./PuzzleGrid";
import {SolveData} from "./types";
import styles from "./SolveDataListItem.module.css"
import { isNyt } from "./predicates";
import { useNavigate } from "react-router-dom";
import { getSolveTimeFormatted, getTitle } from "./tools";

interface SolveDataListItemProps {
  solveData: SolveData;
}

function SolveDataListItem({ solveData }: SolveDataListItemProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (isNyt(solveData.puzzle)) {
      navigate(`/puzzle?nyt_print_date=${solveData.puzzle.nytPrintDate}`)
    }
    else {
      navigate(`/puzzle?id=${solveData.id}`)
    }
  }

  return (
    <Button className={styles.button} fullWidth onClick={handleClick}>
      <Center className={styles["box-puzzle"]} inline>
        <PuzzleGrid searchKey={{ puzzleId: solveData.puzzle.id }} solveData={solveData} />
      </Center>
      <Box className={styles["box-info"]}>
        <h1 className={styles.title}>
          <span>{getTitle(solveData)}</span>
          <PillGroup>
            {solveData.groups.map(group => (
              <Pill key={group.name} size={"lg"} style={{ backgroundColor: group.color }}>
                {group.name}
              </Pill>
            ))}
          </PillGroup>
        </h1>
        <h1>{getSolveTimeFormatted(solveData)}</h1>
      </Box>
    </Button>
  )
}

export default SolveDataListItem