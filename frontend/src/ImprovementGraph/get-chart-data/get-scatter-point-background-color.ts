import { SolveData, SolveDataSummary } from "../../types";
import { quickselect } from "d3-array";

export function getScatterPointBackgroundColor(solveDataSummaryList: SolveDataSummary[], solveData?: SolveData) {
  const solveTimes = solveDataSummaryList.map(summary => summary.time)
  const [gold, silver, bronze] = [0, 1, 2].map(k => quickselect(solveTimes, k)[k])
  return solveDataSummaryList.map(item => {
    if (solveData && item.id === solveData.id) return "blue"
    if (item.time === gold) return "gold"
    if (item.time === silver) return "silver"
    if (item.time === bronze) return "orange"
    return "green"
  })
}