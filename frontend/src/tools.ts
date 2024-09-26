import { SolveData } from "./types";
import { isNyt } from "./predicates";
import { Duration, format, formatDuration, intervalToDuration, parse } from "date-fns";

export function getTitle(solveData: SolveData) {
  let title = solveData.puzzle.title
  if (isNyt(solveData.puzzle)) {
    const desc = `NYT ${format(parse(solveData.puzzle.nytPrintDate, "yyyy-MM-dd", new Date()), "MM/dd/yyyy")}`
    if (!title) return desc
    return `${title} (${desc})`
  }
  else if (!title) return "Untitled Puzzle"
  return title
}

export function getSolveTimeFormatted(solveData: SolveData) {
  return formatSeconds(solveData.time)
}

export function formatSeconds(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  let format: (keyof Duration)[] = ["minutes", "seconds"]
  if (duration.days) format = ["days", "hours", "minutes", "seconds"]
  else if (duration.hours) format = ["hours", "minutes", "seconds"]
  format.forEach(key => duration[key] ??= 0)
  const zeroPad = (num: number) => String(num).padStart(2, "0")
  return formatDuration(duration, {
    format,
    zero: true,
    delimiter: ":",
    locale: {
      formatDistance: (_token, count) => zeroPad(count)
    }
  })
}