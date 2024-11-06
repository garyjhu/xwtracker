import { bin } from "d3-array";
import { ChartData, ChartOptions } from "chart.js";
import { formatSeconds } from "../../tools";
import { SolveData, SolveDataSummary } from "../../types";

export function getChartProps(solveDataSummaryList: SolveDataSummary[], solveData?: SolveData) {
  const bins = bin()(solveDataSummaryList.map(summary => summary.time))
  const labels = bins.map(bin => bin.x0)
  labels.push(bins[bins.length - 1].x1)

  const data: ChartData<"bar"> = {
    labels,
    datasets: [{
      data: bins.map(bin => bin.length),
      barPercentage: 1.2,
      backgroundColor: bins.map((bin, index) => {
        if (solveData && bin.x0 !== undefined && bin.x1 !== undefined && bin.x0 <= solveData.time && (solveData.time < bin.x1 || index == bins.length - 1)) {
          return "blue"
        }
        return "green"
      })
    }]
  }

  const options: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false,
        max: labels[labels.length - 2],
      },
      x2: {
        display: true,
        grid: {
          display: false
        },
        offset: false,
        ticks: {
          callback: (value) => formatSeconds(Number(labels[Number(value)]))
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return { type: "bar", data, options }
}