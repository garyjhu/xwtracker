import { ScriptableTooltipContext } from "chart.js";
import { SolveDataSummary } from "../../types";
import { TooltipStateHandler } from "../ImprovementGraph";

export function getExternalTooltipHandler(solveDataSummaryList: SolveDataSummary[], onChange: TooltipStateHandler) {
  return ({ chart, tooltip }: ScriptableTooltipContext<"line">) => {
    if (tooltip.opacity === 0) {
      onChange({ style: { opacity: 0 }})
    }
    else {
      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas
      console.log(positionX, positionY, tooltip.caretX, tooltip.caretY)
      onChange({
        solveDataId: solveDataSummaryList[tooltip.dataPoints[0].dataIndex].id,
        style: {
          opacity: 1,
          left: positionX + tooltip.caretX + "px",
          top: positionY + tooltip.caretY + 10 + "px",
        }
      })
    }
  }
}