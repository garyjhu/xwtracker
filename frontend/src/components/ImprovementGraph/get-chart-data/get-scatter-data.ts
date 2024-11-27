import { SolveDataSummary } from "../../../utils/types";

export function getScatterData(solveDataSummaryList: SolveDataSummary[]) {
  return solveDataSummaryList.map(item => ({
    x: new Date(item.date).getTime(),
    y: item.time / 60
  }))
}
