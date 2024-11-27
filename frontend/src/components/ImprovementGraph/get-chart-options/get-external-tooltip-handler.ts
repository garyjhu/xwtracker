import { ScriptableTooltipContext } from "chart.js";
import { SolveDataSummary } from "../../../utils/types";
import { TooltipStateHandler } from "../ImprovementGraph";

export function getExternalTooltipHandler(solveDataSummaryList: SolveDataSummary[], onChange: TooltipStateHandler) {
  return ({ chart, tooltip }: ScriptableTooltipContext<"line">) => {
    if (tooltip.opacity === 0) {
      onChange({ style: { opacity: 0 }})
      chart.canvas.style.cursor = "default"
    }
    else {
      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas
      onChange({
        solveDataSummary: solveDataSummaryList[tooltip.dataPoints[0].dataIndex],
        style: {
          opacity: 1,
          left: positionX + tooltip.caretX + "px",
          top: positionY + tooltip.caretY + 10 + "px",
        }
      })
      chart.canvas.style.cursor = "pointer"
    }
  }
}