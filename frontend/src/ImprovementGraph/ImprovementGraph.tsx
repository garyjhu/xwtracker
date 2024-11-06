import { SolveData } from "../types";
import {
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement, ScatterController,
  TimeScale
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveDataSummaryListOptions } from "../api";
import { useAuthenticatedUser } from "../hooks";
import "chartjs-adapter-date-fns"
import "date-fns"
import { CSSProperties, useEffect, useRef, useState } from "react";
import ExternalTooltip from "./ExternalTooltip";
import { getChartData } from "./get-chart-data";
import { getChartOptions } from "./get-chart-options";

interface GraphProps {
  solveGroup: string,
  solveData?: SolveData
}

export interface TooltipState {
  solveDataId?: string,
  style?: CSSProperties
}

export type TooltipStateHandler = (state: TooltipState) => void

export function ImprovementGraph({ solveGroup, solveData }: GraphProps) {
  const user = useAuthenticatedUser()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const [tooltipState, setTooltipState] = useState<TooltipState>({})

  const { isPending, isError, data: solveDataSummaryList, error, fetchStatus } = useQuery(fetchSolveDataSummaryListOptions(user, [solveGroup]))

  useEffect(() => {
    if (!canvasRef.current || !solveDataSummaryList) return

    Chart.register(LineController, ScatterController, PointElement, LineElement, LinearScale, TimeScale)
    const data = getChartData(solveDataSummaryList, solveData)
    const options = getChartOptions(solveDataSummaryList, state => setTooltipState(state))
    chartRef.current = new Chart(canvasRef.current, { type: "line", data, options })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [solveDataSummaryList, solveData]);

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  return (
    <div style={{ margin: "10rem" }}>
      <canvas ref={canvasRef}></canvas>
      <ExternalTooltip {...tooltipState} />
    </div>
  )
}