import { NavigateFunction } from "react-router-dom";
import { MutableRefObject } from "react";
import { ActiveElement, Chart, ChartEvent } from "chart.js";
import { SolveDataSummary } from "../../../utils/types";

export function getClickEventHandler(
  solveDataSummaryList: SolveDataSummary[],
  chartRef: MutableRefObject<Chart | null>,
  navigate: NavigateFunction)
{
  return (_event: ChartEvent, elements: ActiveElement[]) => {
    if (!chartRef.current) return

    elements.forEach(item => {
      const solveDataId = solveDataSummaryList[item.index].puzzle.id
      navigate(`/puzzle?puzzle_id=${solveDataId}`)
    })
  }
}