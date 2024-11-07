import { Bin } from "d3-array";
import { ChartData } from "chart.js";
import { SolveData } from "../../types";
import { getTicks } from "../get-ticks";
import { getBarBackgroundColor } from "./get-bar-background-color";

function getBarData(bins: Bin<number, number>[]) {
  return bins.map(bin => bin.length)
}

export function getChartData(bins: Bin<number, number>[], solveData?: SolveData): ChartData<"bar"> {
  const barLabels = getTicks(bins)
  const barData = getBarData(bins)
  const barBackgroundColor = getBarBackgroundColor(bins, solveData)

  return {
    labels: barLabels,
    datasets: [{
      data: barData,
      barPercentage: 1.2,
      backgroundColor: barBackgroundColor
    }]
  }
}