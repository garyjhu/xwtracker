import { SolveData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveDataSummaryList } from "../api";
import { useAuthenticatedUser } from "../hooks";
import {
  BarController,
  BarElement,
  CategoryScale, Chart,
  LinearScale
} from "chart.js";
import { useEffect, useRef } from "react";
import { getChartData } from "./get-chart-data";
import { getChartOptions } from "./get-chart-options";
import { binCached } from "./bin-cached";
import { getBarBackgroundColor } from "./get-chart-data";
import { Box } from "@mantine/core";


interface GraphProps {
  solveGroup: string,
  solveData?: SolveData
}
export default function DistributionGraph({ solveGroup, solveData }: GraphProps) {
  const user = useAuthenticatedUser()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const { isPending, isError, data: solveTimes, error, fetchStatus } = useQuery({
    queryKey: ["fetchSolveTimes", user.uid, [solveGroup]],
    queryFn: async () => {
      const solveDataSummaryList = await fetchSolveDataSummaryList(user, "time", "asc", [solveGroup])
      return solveDataSummaryList.map(summary => summary.time / 60)
    }
  })

  useEffect(() => {
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [solveTimes]);

  useEffect(() => {
    if (!canvasRef.current || !solveTimes) return

    const bins = binCached(solveTimes)
    if (!chartRef.current) {
      Chart.register(BarController, LinearScale, CategoryScale, BarElement)
      const data = getChartData(bins, solveData)
      const options = getChartOptions(bins)
      chartRef.current = new Chart(canvasRef.current, { type: "bar", data, options })
    }
    else {
      const barBackgroundColor = getBarBackgroundColor(bins, solveData)
      chartRef.current.data.datasets.forEach(dataset => dataset.backgroundColor = barBackgroundColor)
      chartRef.current.update("none")
    }
  }, [solveTimes, solveData]);

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  return (
    <Box w={"100%"}>
      <canvas ref={canvasRef}></canvas>
    </Box>
  )
}
