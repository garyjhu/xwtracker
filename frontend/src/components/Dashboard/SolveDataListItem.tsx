import { Box, Button, Center, Pill, PillGroup } from "@mantine/core";
import { PuzzleGrid } from "../PuzzleGrid";
import {SolveData} from "../../utils/types";
import styles from "./SolveDataListItem.module.css"
import { isNyt } from "../../utils/predicates";
import { useNavigate } from "react-router-dom";
import { getSolveTimeFormatted, getTitle } from "../../utils/tools";

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
      navigate(`/puzzle?puzzle_id=${solveData.puzzle.id}`)
    }
  }

  return (
    <Button className={styles.button} fullWidth onClick={handleClick}>
      <Center className={styles["box-puzzle"]}>
        <PuzzleGrid searchKey={{ puzzleId: solveData.puzzle.id }} />
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