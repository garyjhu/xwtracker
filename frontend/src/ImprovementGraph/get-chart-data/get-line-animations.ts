import { AnimationsSpec, ScriptableContext } from "chart.js";
import binarySearch from "binary-search";
import { Point } from "./types";

export function getLineAnimations(data: Point[]): AnimationsSpec<"line"> {
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
  const animations = (ctx: ScriptableContext<"line">) => {
    if (ctx.type !== "data") return undefined
    return {
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
  }
  return animations as unknown as AnimationsSpec<"line">
}
