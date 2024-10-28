import { SolveData } from "./types";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveDataSummaryListOptions } from "./api";
import { useAuthenticatedUser } from "./hooks";
import { Chart } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";
import { bin } from "d3-array";
import { useMantineTheme } from "@mantine/core";
import { formatSeconds } from "./tools";

interface GraphProps {
  solveGroup: string,
  solveData?: SolveData
}
export default function DistributionGraph({ solveGroup, solveData }: GraphProps) {
  const user = useAuthenticatedUser()
  const theme = useMantineTheme()

  const { isPending, isError, data: solveDataSummaryList, error, fetchStatus } = useQuery(fetchSolveDataSummaryListOptions(user, [solveGroup]))

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  const bins = bin()(solveDataSummaryList.map(summary => summary.time))
  const labels = bins.map(bin => bin.x0)
  labels.push(bins[bins.length - 1].x1)

  const data: ChartData<"bar"> = {
    labels,
    datasets: [{
      data: bins.map(bin => bin.length),
      barPercentage: 1.2,
      backgroundColor: bins.map((bin, index) => {
        if (solveData && bin.x0 !== undefined && bin.x1 !== undefined && bin.x0 <= solveData.time && (solveData.time < bin.x1 || index == bins.length - 1)) {
          return "blue"
        }
        return theme.primaryColor
      })
    }]
  }

  const options: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false,
        max: labels[labels.length - 2],
      },
      x2: {
        display: true,
        grid: {
          display: false
        },
        offset: false,
        ticks: {
          callback: (value) => formatSeconds(Number(labels[Number(value)]))
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div style={{ margin: "10rem" }}>
      <Chart type={"bar"} data={data} options={options} />
    </div>
  )
}
