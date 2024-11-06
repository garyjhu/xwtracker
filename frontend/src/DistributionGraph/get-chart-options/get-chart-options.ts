import { ChartOptions } from "chart.js";
import { formatSeconds } from "../../tools";
import { getBarLabels } from "../get-bar-labels";
import { Bin } from "d3-array";

export function getChartOptions(bins: Bin<number, number>[]): ChartOptions<"bar">  {
  const labels = getBarLabels(bins)

  return {
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
}
