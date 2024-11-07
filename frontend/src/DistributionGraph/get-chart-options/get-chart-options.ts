import { ChartOptions } from "chart.js";
import { formatSeconds } from "../../tools";
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
          callback: (_, index) => formatSeconds(ticks[index] * 60)
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }
}
