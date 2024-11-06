import { SolveDataSummary } from "../../types";
import { Point } from "./types";

export function getLineData(solveDataSummaryList: SolveDataSummary[]): Point[] {
  let data: Point[] = []
  let min = Number.MAX_SAFE_INTEGER
  for (const item of solveDataSummaryList) {
    const [x, y] = [new Date(item.date).getTime(), item.time / 60]
    if (min !== Number.MAX_SAFE_INTEGER) {
      data.push({ x, y: min })
    }
    if (y < min) {
      data.push({ x, y })
      min = y
    }
  }
  return data
}
