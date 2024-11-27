import { ChartOptions } from "chart.js";
import { formatSeconds } from "../../../utils/tools";
import { getTicks } from "../get-ticks";
import { Bin } from "d3-array";

export function getChartOptions(bins: Bin<number, number>[]): ChartOptions<"bar">  {
  const ticks = getTicks(bins)

  return {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false,
        max: ticks[ticks.length - 2],
      },
      x2: {
        display: true,
        grid: {
          display: false
        },
        offset: false,
        ticks: {
          callback: (_, index) => {
            if (index === 0) return formatSeconds(0)
            if (index === ticks.length - 1) return ""
            return formatSeconds(ticks[index] * 60)
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Puzzles"
        },
        ticks: {
          autoSkip: false,
          precision: 0
        }
      }
    }
  }
}
