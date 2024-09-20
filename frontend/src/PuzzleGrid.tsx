import PuzzleCell from "./PuzzleCell"
import {SolveData, SolveDataCell} from "./types";
import parse, { attributesToProps, DOMNode, domToReact, Element } from "html-react-parser"
import { useEffect, useRef, useState } from "react";
import { isNyt } from "./predicates";

interface PuzzleGridProps {
  solveData: SolveData,
  showAnswers?: boolean,
}

const getRebusScalingFactors = (svg: SVGElement) => {
  let scalingFactors = []
  for (const cell of svg.querySelectorAll("[data-index]")) {
    const guess = cell.querySelector(".guess") as SVGGraphicsElement
    if (guess) {
      const index = cell.attributes.getNamedItem("data-index")!.value
      if (guess.innerHTML.length >= 2) {
        scalingFactors[Number(index)] = Math.min(0.9, 25 / guess.getBBox().width)
      }
    }
  }
  return scalingFactors
}

export default function PuzzleGrid({ solveData, showAnswers }: PuzzleGridProps) {
  const ref = useRef<null | SVGSVGElement>(null)
  const [scalingFactors, setScalingFactors] = useState<number[]>([])
  const rebus = !solveData.cells.every(cell => !cell.guess || cell.guess.length <= 1)

  useEffect(() => {
    if (showAnswers && ref.current != null && rebus) {
      const newScalingFactors = getRebusScalingFactors(ref.current)
      setScalingFactors(newScalingFactors)
    }
  }, [rebus, showAnswers, solveData])

  if (isNyt(solveData.puzzle)) {
    const replaceGuess = (index: number) => function replace(domNode: any) {
      if (showAnswers && domNode instanceof Element && domNode.attribs.class === "guess") {
        const guess = solveData.cells[index].guess
        const props = attributesToProps(domNode.attribs)
        return <text {...props} fontSize={Number(props["fontSize"]) * (scalingFactors[index] || 1)}>{guess}</text>
      }
    }

    const options = {
      replace(domNode: any) {
        if (domNode instanceof Element && domNode.name === "svg") {
          const props = attributesToProps(domNode.attribs)
          return (
            <svg {...props} ref={ref} visibility={!showAnswers || !rebus || scalingFactors.length ? "visible" : "hidden"}>
              {domToReact(domNode.children as DOMNode[], options)}
            </svg>
          )
        }
        if (domNode instanceof Element && domNode.attribs["data-index"]) {
          const props = attributesToProps(domNode.attribs)
          return (
            <g {...props}>
              {domToReact(domNode.children as DOMNode[], {
                replace: replaceGuess(Number(domNode.attribs["data-index"]))
              })}
            </g>
          )
        }
      }
    }
    return parse(solveData.puzzle.svg, options)
  }
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