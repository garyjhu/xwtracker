import PuzzleCell from "./PuzzleCell"
import {SolveData, SolveDataCell} from "./types";

export default function PuzzleGrid({ solveData }: { solveData: SolveData }) {
  const puzzleStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${solveData.width}, 1fr)`,
    gridTemplateRows: `repeat(${solveData.height}, 1fr)`,
    gridGap: '1px',
    border: '1px solid black'
  }
  return (
    <div style={puzzleStyle}>
      {solveData.cells.map((solveDataCell) => <PuzzleCell solveDataCell={solveDataCell} key={solveDataCell.id} />)}
    </div>
  )
}