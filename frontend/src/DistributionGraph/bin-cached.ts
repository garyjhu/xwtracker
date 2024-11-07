import { bin, Bin } from "d3-array";

const cache = new Map<number[], Bin<number, number>[]>()

export function binCached(data: number[]) {
  let bins = cache.get(data)
  if (!bins) {
    bins = bin()(data)
    cache.set(data, bins)
  }
  return bins
}