import { Bin } from "d3-array";

export function getBarLabels(bins: Bin<number, number>[]) {
  const labels = bins.map(bin => bin.x0)
  labels.push(bins[bins.length - 1].x1)
  return labels
}