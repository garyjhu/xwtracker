import PuzzleCell from "./PuzzleCell"
import {SolveData, SolveDataCell} from "./types";
import parse, { attributesToProps, DOMNode, domToReact, Element } from "html-react-parser"

interface PuzzleGridProps {
  solveData: SolveData,
  height: number,
  width: number
}

export default function PuzzleGrid({ solveData }: { solveData: SolveData }) {
  const options = {
    replace(domNode: any) {
      if (domNode instanceof Element && domNode.name === "svg") {
        const props = attributesToProps(domNode.attribs)
        return <svg { ...props }>{domToReact(domNode.children as DOMNode[])}</svg>
      }
    }
  }
  return parse(solveData.puzzle.svg, options)
  // const puzzleStyle = {
  //   display: 'grid',
  //   gridTemplateColumns: `repeat(${solveData.width}, 1fr)`,
  //   gridTemplateRows: `repeat(${solveData.height}, 1fr)`,
  //   gridGap: '1px',
  //   border: '1px solid black'
  // }
  // return (
  //   <div style={puzzleStyle}>
  //     {solveData.cells.map((solveDataCell) => <PuzzleCell solveDataCell={solveDataCell} key={solveDataCell.id} />)}
  //   </div>
  // )
}