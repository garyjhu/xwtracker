import { SolveData, SolveDataSummary } from "./types";
import { Chart } from "react-chartjs-2"
import {
  AnimationsSpec,
  Chart as ChartJS, ChartData, ChartDataset, ChartEvent, ChartOptions,
  Interaction, InteractionOptions,
  Plugin,
  ScriptableContext,
  ScriptableTooltipContext
} from "chart.js";
import binarySearch from "binary-search"
import { useQuery } from "@tanstack/react-query";
import { getSolveDataSummaryListOptions } from "./api";
import { useAuthenticatedUser } from "./hooks";
import "chart.js/auto"
import "chartjs-adapter-date-fns"
import "date-fns"
import { useMantineTheme } from "@mantine/core";
import { useRef } from "react";
import ExternalTooltip, { SetTooltipState } from "./ExternalTooltip";

interface GraphProps {
  solveGroup: string,
  solveData?: SolveData
}

type Point = { x: number, y: number }

const getScatterDataset = (solveDataSummaryList: SolveDataSummary[]): ChartDataset<"scatter"> => {
  const data = solveDataSummaryList.map(item => ({
    x: new Date(item.date).getTime(),
    y: item.time / 60
  }))
  return { type: "scatter", data, animations: getScatterAnimations(data) }
}

const getLineDataset = (solveDataSummaryList: SolveDataSummary[]): ChartDataset<"line"> => {
  let data: Point[] = []
  for (let i = 0, min = Number.MAX_SAFE_INTEGER; i < solveDataSummaryList.length; i++) {
    if (solveDataSummaryList[i].time < min) {
      if (i !== 0) {
        data.push({
          x: new Date(solveDataSummaryList[i].date).getTime(),
          y: min / 60
        })
      }
      min = solveDataSummaryList[i].time
      data.push({
        x: new Date(solveDataSummaryList[i].date).getTime(),
        y: min / 60
      })
    }
    else {
      data.push({
        x: new Date(solveDataSummaryList[i].date).getTime(),
        y: min / 60
      })
    }
  }
  return { type: "line", data, animations: getLineAnimations(data) }
}

const getScatterAnimations = (data: Point[]): AnimationsSpec<"line"> => {
  const min = data[0].x
  const max = data[data.length - 1].x
  const animations = (ctx: ScriptableContext<"scatter">) => ctx.type === "data"
    ? {
        radius: {
          from: 0,
          fn: (from: number, to: number, factor: number) => {
            const fact = (ctx.parsed.x - min) / (max - min)
            const ret = (1 - (Math.min(Math.max(10 * (fact - factor), 0), 1)))
            return ret * to
          }
        },
        y: {
          fn: (from: number, to: number) => to
        },
      }
    : undefined
  return animations as unknown as AnimationsSpec<"line">
}

const getLineAnimations = (data: Point[]): AnimationsSpec<"line"> => {
  const min = data[0].x
  const max = data[data.length - 1].x
  const factorToPoint = new Map<number, Point>()
  const getCeilingIndex = (time: number) => {
    const index = binarySearch<Point, number>(data, time, (a, b) => a.x < b ? -1 : 1)
    return index >= 0 ? index : -index - 1
  }
  const computePoint = (factor: number): Point => {
    if (factor === 0) return data[0]
    const time = min + factor * (max - min)
    const ceil = getCeilingIndex(time)
    const segmentFactor = (time - data[ceil - 1].x) / (data[ceil].x - data[ceil - 1].x)
    return {
      x: time,
      y: data[ceil - 1].y + segmentFactor * (data[ceil].y - data[ceil - 1].y)
    }
  }
  const animations = (ctx: ScriptableContext<"line">) => ctx.type === "data"
    ? {
        x: {
          from: data[0].x,
          fn: (from: number, to: number, factor: number) => {
            let point = factorToPoint.get(factor)
            if (!point) {
              point = computePoint(factor)
              factorToPoint.set(factor, point)
            }
            return ctx.chart.scales.x.getPixelForValue(Math.min(point.x, ctx.parsed.x))
          }
        },
        y: {
          from: data[0].y,
          fn: (from: number, to: number, factor: number) => {
            let point = factorToPoint.get(factor)
            if (!point) {
              point = computePoint(factor)
              factorToPoint.set(factor, point)
            }
            return ctx.chart.scales.y.getPixelForValue(point.x < ctx.parsed.x ? point.y : ctx.parsed.y)
          }
        }
      }
    : undefined
  return animations as unknown as AnimationsSpec<"line">
}


export default function ImprovementGraph({ solveGroup }: GraphProps) {
  const user = useAuthenticatedUser()
  const theme = useMantineTheme()
  const ref = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<SetTooltipState>(null)

  const { isPending, isError, data: solveDataSummaryList, error, fetchStatus } = useQuery(getSolveDataSummaryListOptions(user, solveGroup))

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  Interaction.modes.scatterOnly = (chart: ChartJS, e: ChartEvent, options: InteractionOptions, useFinalPosition?: boolean) => {
    return Interaction.modes.index(chart, e, options, useFinalPosition).filter(item => item.datasetIndex === 0)
  }

  const externalTooltipHandler = ({ chart, tooltip }: ScriptableTooltipContext<"line">) => {
    if (tooltipRef.current) {
      const setState = tooltipRef.current.setState

      if (tooltip.opacity === 0) {
        setState({ style: { opacity: 0 }})
      }
      else {
        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas
        setState({
          solveDataId: solveDataSummaryList[tooltip.dataPoints[0].dataIndex].id,
          style: {
            opacity: 1,
            left: positionX + tooltip.caretX + "px",
            top: positionY + tooltip.caretY + "px",
          }
        })
      }
    }
  }

  const data: ChartData = {
    datasets: [
      {
        ...getScatterDataset(solveDataSummaryList),
        pointBackgroundColor: "cyan",
        pointHoverBackgroundColor: "green",
        pointRadius: 5,
      },
      {
        ...getLineDataset(solveDataSummaryList),
        borderColor: theme.primaryColor,
        pointRadius: 0,
      }
    ],
  }

  const options: ChartOptions = {
    animation: {
      duration: 1000,
      easing: "linear" as const
    },
    events: ["mousemove" as const, "mouseout" as const],
    interaction: {
      intersect: false,
      mode: "scatterOnly" as const
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false,
        position: "nearest" as const,
        external: externalTooltipHandler
      }
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month" as const
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

  const plugins: Plugin[] = [{
    id: "mouseleaveCatcher",
    beforeEvent: (_, args) => !(args.event.type === "mouseout" && ref.current?.matches(":hover"))
  }]

  return (
    <div ref={ref} style={{ margin: "10rem" }}>
      <Chart type={"line"} data={data} options={options} plugins={plugins} />
      <ExternalTooltip ref={tooltipRef} />
    </div>
  )
}