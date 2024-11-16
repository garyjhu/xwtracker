import { SolveData, SolveDataSummary } from "./types";
import { isNyt } from "./predicates";
import { Duration, formatDuration, intervalToDuration } from "date-fns";
import { bisector } from "d3-array";
import dayjs from "dayjs";

export function getTitle(solveData: SolveData) {
  let title = solveData.puzzle.title
  if (isNyt(solveData.puzzle)) {
    const desc = `New York Times — ${dayjs(solveData.puzzle.nytPrintDate).format("dddd, MMMM D, YYYY")}`
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
  const formatted = formatDuration(duration, {
    format,
    zero: true,
    delimiter: ":",
    locale: {
      formatDistance: (_, count) => zeroPad(count)
    }
  })
  return formatted.replace(/^0/, "")
}

export function formatDifference(time1: number, time2: number) {
  if (time1 === time2) return "(-)"
  const diff = time1 - time2
  return `(${diff > 0 ? "+" : "-"}${formatSeconds(Math.abs(diff))})`
}

export function countSolvesBetweenDates(summaryList: SolveDataSummary[], dateStart: Date, dateEnd: Date) {
  const summaryListBisector = bisector<SolveDataSummary, Date>(summary => new Date(summary.date))
  return summaryListBisector.left(summaryList, dateEnd) - summaryListBisector.left(summaryList, dateStart)
}