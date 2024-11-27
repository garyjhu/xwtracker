import { AnimationsSpec, ScriptableContext } from "chart.js";
import { Point } from "./types";

export function getScatterAnimations(data: Point[]): AnimationsSpec<"line"> {
  if (data.length === 0) return {}
  const min = data[0].x
  const max = data[data.length - 1].x
  const animations = (ctx: ScriptableContext<"scatter">) => {
    if (ctx.type !== "data" || ctx.mode !== "default") return undefined
    return {
      radius: {
        from: 0,
        fn: (_from: number, to: number, factor: number) => {
          const fact = (ctx.parsed.x - min) / (max - min)
          const ret = (1 - (Math.min(Math.max(10 * (fact - factor), 0), 1)))
          return ret * to
        }
      },
      y: {
        fn: (_from: number, to: number) => to
      },
    }
  }
  return animations as unknown as AnimationsSpec<"line">
}
