import { Bin } from "d3-array";
import { SolveData } from "../../../utils/types";

export function getBarBackgroundColor(bins: Bin<number, number>[], solveData?: SolveData) {
  return bins.map((bin, index) => {
    if (solveData && bin.x0! <= solveData.time / 60 && (solveData.time / 60 < bin.x1! || index == bins.length - 1)) {
      return "blue"
    }
    return "green"
  })
}

