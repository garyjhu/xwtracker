import { bin, Bin, deviation, max, median, min } from "d3-array";

const cache = new Map<number[], Bin<number, number>[]>()

export function binCached(data: number[]) {
  let bins = cache.get(data)
  if (!bins) {
    const maxVal = Math.min(max(data)!, median(data)! + 2 * deviation(data)!)
    const binner = bin().domain([min(data)!, maxVal])
    bins = binner(data.map(val => Math.min(val, maxVal)))
    cache.set(data, bins)
  }
  return bins
}