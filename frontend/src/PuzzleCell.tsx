import {SolveDataCell} from "./types";

export default function PuzzleCell({ solveDataCell }: { solveDataCell: SolveDataCell }) {
  if (solveDataCell.blank) {
    return <span>{solveDataCell.guess}</span>
  } 
  else return <span style={{ backgroundColor: 'black' }}></span>
}
