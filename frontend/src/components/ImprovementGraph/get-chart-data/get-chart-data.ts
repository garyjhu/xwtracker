import { SolveData, SolveDataSummary } from "../../../utils/types";
import { ChartData } from "chart.js";
import { getScatterData } from "./get-scatter-data";
import { getScatterAnimations } from "./get-scatter-animations";
import { getScatterPointBackgroundColor } from "./get-scatter-point-background-color";
import { getLineData } from "./get-line-data";
import { getLineAnimations } from "./get-line-animations";

export function getChartData(solveDataSummaryList: SolveDataSummary[], solveData?: SolveData): ChartData {
  const scatterData = getScatterData(solveDataSummaryList)
  const scatterAnimations = getScatterAnimations(scatterData)
  const scatterPointBackgroundColor = getScatterPointBackgroundColor(solveDataSummaryList, solveData)

  const lineData = getLineData(solveDataSummaryList)
  const lineAnimations = getLineAnimations(lineData)
  return {
    datasets: [
      {
        type: "scatter",
        data: scatterData,
        animations: scatterAnimations,
        pointBackgroundColor: scatterPointBackgroundColor,
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        type: "line",
        data: lineData,
        animations: lineAnimations,
        borderColor: "yellow",
        pointRadius: 0,
      }
    ],
  }
}