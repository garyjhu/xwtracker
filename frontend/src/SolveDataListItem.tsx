import { Box, Button, Center, Flex } from "@mantine/core";
import PuzzleGrid from "./PuzzleGrid";
import {SolveData} from "./types";
import styles from "./SolveDataListItem.module.css"

interface SolveDataListItemProps {
  solveData: SolveData;
  key?: number;
}

function SolveDataListItem({ solveData, key }: SolveDataListItemProps) {
  return (
    <Button className={styles.button} fullWidth={true} key={key}>
      <Flex className={styles.flex}>
        <Center className={styles.box} inline>
          <PuzzleGrid solveData={solveData} />
        </Center>
        <Box>
          <h1>{new Date(solveData.time * 1000).toISOString().slice(11, 19)}</h1>
        </Box>
      </Flex>
    </Button>
  )
}

export default SolveDataListItem