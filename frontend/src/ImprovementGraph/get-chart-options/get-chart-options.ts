import { getExternalTooltipHandler } from "./get-external-tooltip-handler";
import { SolveDataSummary } from "../../types";
import { TooltipStateHandler } from "../ImprovementGraph";
import { Chart, ChartEvent, ChartOptions, Interaction, InteractionOptions } from "chart.js";

export function getChartOptions(solveDataSummaryList: SolveDataSummary[], tooltipStateHandler: TooltipStateHandler): ChartOptions {
  Interaction.modes.scatterOnly = (chart: Chart, e: ChartEvent, options: InteractionOptions, useFinalPosition?: boolean) => {
    return Interaction.modes.index(chart, e, options, useFinalPosition).filter(item => item.datasetIndex === 0)
  }

  const externalTooltipHandler = getExternalTooltipHandler(solveDataSummaryList, tooltipStateHandler)

  return {
    animation: {
      duration: 1000,
      easing: "linear"
    },
    interaction: {
      intersect: false,
      mode: "scatterOnly"
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        external: externalTooltipHandler
      }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month"
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Solve Time (minutes)",
          font: {
            size: 24,
          }
        },
        ticks: {
          font: {
            size: 18,
          }
        }
      }
    }
  }
}