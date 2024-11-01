import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useAuthenticatedUser } from "./hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchSolveDataSummaryListOptions } from "./api";
import { DashboardState, DashboardStateEventHandler } from "./Dashboard";
import { countSolvesBetweenDates } from "./tools";
import dayjs from "dayjs";
import { useMantineTheme } from "@mantine/core";
import styles from "./Calendar.module.css"

type CalendarProps = Pick<DashboardState, "selectedGroups" | "dateStart"> & {
  onChange: DashboardStateEventHandler
}

export default function Calendar({ dateStart, selectedGroups, onChange }: CalendarProps) {
  const user = useAuthenticatedUser()
  const theme = useMantineTheme()

  const { isPending, isError, data: summaryList, error, fetchStatus } = useQuery(fetchSolveDataSummaryListOptions(user, [...selectedGroups]))

  if (isPending) {
    return <span>Loading... {fetchStatus}</span>
  }

  if (isError) return <span>Error: {error.message}</span>

  const getDayProps: DatePickerProps["getDayProps"] = (date) => {
    const numSolves = countSolvesBetweenDates(summaryList, date, dayjs(date).add(1, "day").toDate())
    const colorIndex = Math.min(numSolves - 1, 9)
    return {
      className: styles.day,
      style: numSolves > 0 ? {
        "--background-color": theme.colors.blue[colorIndex],
        "--hover-color": theme.colors.aquamarine[colorIndex],
      } : undefined,
    }
  }

  const handleChange: DatePickerProps["onChange"] = (val) => {
    if (val) {
      onChange({
        dateStart: val,
        dateEnd: dayjs(val).add(1, "d").subtract(1, "ms").toDate()
      })
    }
    else {
      onChange({
        dateStart: undefined,
        dateEnd: undefined
      })
    }
  }

  return (
    <DatePicker
      allowDeselect
      firstDayOfWeek={0}
      getDayProps={getDayProps}
      weekendDays={[]}
      value={dateStart ?? null}
      onChange={handleChange}
    />
  )
}