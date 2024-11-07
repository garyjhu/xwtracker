import { SolveData } from "../types";
import {
  Chart, ChartDataset,
  LinearScale,
  LineController,
  LineElement,
  PointElement, ScatterController,
  TimeScale, Tooltip
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveDataSummaryListOptions } from "../api";
import { useAuthenticatedUser } from "../hooks";
import "chartjs-adapter-date-fns"
import "date-fns"
import { CSSProperties, useEffect, useRef, useState } from "react";
import ExternalTooltip from "./ExternalTooltip";
import { getChartData, getScatterPointBackgroundColor } from "./get-chart-data";
import { getChartOptions } from "./get-chart-options";
import { useNavigate } from "react-router-dom";
import { Box } from "@mantine/core";

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
  const navigate = useNavigate()

  const { isPending, isError, data: solveDataSummaryList, error, fetchStatus } = useQuery(fetchSolveDataSummaryListOptions(user, [solveGroup]))

  useEffect(() => {
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [solveDataSummaryList]);

  useEffect(() => {
    if (!canvasRef.current || !solveDataSummaryList) return

    if (!chartRef.current) {
      Chart.register(LineController, ScatterController, PointElement, LineElement, LinearScale, TimeScale, Tooltip)
      const data = getChartData(solveDataSummaryList, solveData)
      const options = getChartOptions(solveDataSummaryList, state => setTooltipState(state), chartRef, navigate)
      chartRef.current = new Chart(canvasRef.current, { type: "line", data, options })
    }
    else {
      const scatterPointBackgroundColor = getScatterPointBackgroundColor(solveDataSummaryList, solveData)
      for (const dataset of chartRef.current.data.datasets) {
        if (dataset.type === "scatter") {
          dataset.pointBackgroundColor = scatterPointBackgroundColor
        }
      }
      chartRef.current.update("none")
    }
  }, [solveDataSummaryList, solveData, navigate]);

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  return (
    <Box w={"100%"}>
      <canvas ref={canvasRef}></canvas>
      <ExternalTooltip {...tooltipState} />
    </Box>
  )
}