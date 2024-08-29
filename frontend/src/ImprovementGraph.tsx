import { GraphProps, SolveData, SolveTimeListItem } from "./types";
import {useQuery} from "@tanstack/react-query/build/modern";
import axios from "axios";
import { Chart } from "react-chartjs-2"
import { AnimationsSpec, ScriptableContext } from "chart.js";
import binarySearch from "binary-search"
import { getSolveTimesOptions } from "./api";
import { useUser } from "./hooks";

type Point = { x: number, y: number }

function getScatterDataset(solveTimesList: SolveTimeListItem[]) {
  const data = solveTimesList.map(item => ({
    x: item.solveDate.getTime(),
    y: item.solveTime / 60
  }))
  return { data, animations: getScatterAnimations(data) }
}

function getLineDataset(solveTimesList: SolveTimeListItem[]) {
  let data: Point[] = []
  let radius: number[] = []
  for (let i = 0, min = Number.MAX_SAFE_INTEGER; i < solveTimesList.length; i++) {
    if (solveTimesList[i].solveTime < min) {
      data.push({
        x: solveTimesList[i].solveDate.getTime(),
        y: min / 60
      })
      data.push({
        x: solveTimesList[i].solveDate.getTime(),
        y: solveTimesList[i].solveTime / 60
      })
      radius.push(0)
      radius.push(3)
    }
  }
  return { data, radius, animations: getLineAnimations(data) }
}

function getScatterAnimations(data: Point[]): AnimationsSpec<"line"> {
  const min = data[0].x
  const max = data[data.length - 1].x
  const animations = (ctx: ScriptableContext<"scatter">) => ctx.type === "data"
    ? {
        visible: {
          from: false,
          fn: (from: number, to: number, factor: number) => min + (max - min) * factor >= ctx.parsed.x
        }
      }
    : undefined
  return animations as unknown as AnimationsSpec<"line">
}

function getLineAnimations(data: Point[]): AnimationsSpec<"line"> {
  const min = data[0].x
  const max = data[data.length - 1].x
  const factorToPoint = new Map<number, Point>()
  const getCeilingIndex = (time: number) => binarySearch<Point, number>(data, time, (a, b) => a.x < b ? -1 : 1)
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

export default function ImprovementGraph({ solveTimesList, solveData }: GraphProps) {
  const data = {
    datasets: [
      {
        ...getScatterDataset(solveTimesList),
      },
      {
        ...getLineDataset(solveTimesList),
      }
    ],
    options: {
      animation: {
        duration: 500,
        easing: "linear"
      },
      scales: {
        x: {
          time: {
            unit: "month"
          }
        }
      }
    }
  }
  return <Chart type={"scatter"} data={data} />
}