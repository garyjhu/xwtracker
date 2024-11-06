import { Bin } from "d3-array";
import { ChartData } from "chart.js";
import { SolveData } from "../../types";
import { getBarLabels } from "../get-bar-labels";

function getBarData(bins: Bin<number, number>[]) {
  return bins.map(bin => bin.length)
}

function getBarBackgroundColor(bins: Bin<number, number>[], solveData?: SolveData) {
  return bins.map((bin, index) => {
    if (solveData && bin.x0! <= solveData.time && (solveData.time < bin.x1! || index == bins.length - 1)) {
      return "blue"
    }
    return "green"
  })
}

export function getChartData(bins: Bin<number, number>[], solveData?: SolveData): ChartData<"bar"> {
  const barlabels = getBarLabels(bins)
  const barData = getBarData(bins)
  const barBackgroundColor = getBarBackgroundColor(bins, solveData)

  return {
    labels: barlabels,
    datasets: [{
      data: barData,
      barPercentage: 1.2,
      backgroundColor: barBackgroundColor
    }]
  }
}