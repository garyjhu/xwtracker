import { bisectLeft, mean, quantileSorted } from "d3-array";

interface SolveGroupStats {
  count: number,
  median: number,
  mean: number,
  min: number,
  max: number,
  q25: number,
  q75: number,
  percentile: (time: number) => number
}

export function getStats(solveTimes: number[]): SolveGroupStats {
  const n = solveTimes.length
  return {
    count: n,
    median: quantileSorted(solveTimes, 0.5)!,
    mean: mean(solveTimes)!,
    min: quantileSorted(solveTimes, 0)!,
    max: quantileSorted(solveTimes, 1)!,
    q25: quantileSorted(solveTimes, 0.25)!,
    q75: quantileSorted(solveTimes, 0.75)!,
    percentile: time => Math.round((n - bisectLeft(solveTimes, time)) / n * 100)
  }
}