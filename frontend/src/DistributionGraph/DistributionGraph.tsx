import { SolveData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveDataSummaryListOptions } from "../api";
import { useAuthenticatedUser } from "../hooks";
import {
  BarController,
  BarElement,
  CategoryScale, Chart,
  LinearScale
} from "chart.js";
import { bin } from "d3-array";
import { useEffect, useRef } from "react";
import { getChartData } from "./get-chart-data";
import { getChartOptions } from "./get-chart-options";

interface GraphProps {
  solveGroup: string,
  solveData?: SolveData
}
export default function DistributionGraph({ solveGroup, solveData }: GraphProps) {
  const user = useAuthenticatedUser()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const { isPending, isError, data: solveDataSummaryList, error, fetchStatus } = useQuery(fetchSolveDataSummaryListOptions(user, [solveGroup]))

  useEffect(() => {
    if (!canvasRef.current || !solveDataSummaryList) return

    Chart.register(BarController, LinearScale, CategoryScale, BarElement)
    const bins = bin()(solveDataSummaryList.map(summary => summary.time))
    const data = getChartData(bins, solveData)
    const options = getChartOptions(bins)
    chartRef.current = new Chart(canvasRef.current, { type: "bar", data, options })

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
    <canvas ref={canvasRef}></canvas>
  )
}
