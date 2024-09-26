import { SolveData } from "./types";
import { isNyt } from "./predicates";
import { format, parse } from "date-fns";

export function getTitle(solveData: SolveData) {
  let title = solveData.puzzle.title
  if (isNyt(solveData.puzzle)) {
    const desc = `NYT ${format(parse(solveData.puzzle.nytPrintDate, "yyyy-MM-dd", new Date()), "MM/dd/yyyy")}`
    if (!title) return desc
    return `${title} (${desc})`
  }
  else if (!title) return "Untitled Puzzle"
  return title
}

export function getSolveTimeFormatted(solveData: SolveData) {
  return new Date(solveData.time * 1000).toISOString().slice(11, 19)
}