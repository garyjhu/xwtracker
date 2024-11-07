import { Bin } from "d3-array";

export function getTicks(bins: Bin<number, number>[]) {
  const ticks = bins.map(bin => bin.x0!)
  ticks.push(bins[bins.length - 1].x1!)
  return ticks
}