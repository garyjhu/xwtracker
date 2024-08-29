import { Box, Button, Center, Flex } from "@mantine/core";
import PuzzleGrid from "./PuzzleGrid";
import {SolveData} from "./types";

function SolveDataListItem({ solveData }: { solveData: SolveData }) {
  return (
    <Button>
      <Flex>
        <Center>
          <PuzzleGrid solveData={solveData} />
        </Center>
        <Box>
          <h1>{solveData.title}</h1>
          <h1>{new Date(solveData.secondsSpentSolving * 1000).toISOString().slice(11, 19)}</h1>
        </Box>
      </Flex>
    </Button>
  )
}

export default SolveDataListItem