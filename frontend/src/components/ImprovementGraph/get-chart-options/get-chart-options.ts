import { getExternalTooltipHandler } from "./get-external-tooltip-handler";
import { SolveDataSummary } from "../../../utils/types";
import { TooltipStateHandler } from "../ImprovementGraph";
import { Chart, ChartEvent, ChartOptions, Interaction, InteractionOptions } from "chart.js";
import { NavigateFunction } from "react-router-dom";
import { MutableRefObject } from "react";
import { getClickEventHandler } from "./get-click-event-handler";

export function getChartOptions(
  solveDataSummaryList: SolveDataSummary[],
  tooltipStateHandler: TooltipStateHandler,
  chartRef: MutableRefObject<Chart | null>,
  navigate: NavigateFunction
): ChartOptions {
  Interaction.modes.scatterOnly = (chart: Chart, e: ChartEvent, options: InteractionOptions, useFinalPosition?: boolean) => {
    return Interaction.modes.index(chart, e, options, useFinalPosition).filter(item => item.datasetIndex === 0)
  }

  const externalTooltipHandler = getExternalTooltipHandler(solveDataSummaryList, tooltipStateHandler)
  const handleClick = getClickEventHandler(solveDataSummaryList, chartRef, navigate)

  return {
    animation: {
      duration: 1000,
      easing: "linear"
    },
    interaction: {
      intersect: false,
      mode: "scatterOnly"
    },
    onClick: handleClick,
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
        ticks: {
          maxRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Solve Time (minutes)",
        },
        ticks: {
          precision: 0
        }
      }
    }
  }
}