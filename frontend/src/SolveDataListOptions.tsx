import styles from "./SolveDataListOptions.module.css";
import { MultiSelect, NativeSelect, SegmentedControl } from "@mantine/core";
import { DashboardState } from "./Dashboard";
import { ChangeEvent } from "react";
import GroupSelect from "./GroupSelect";

interface SolveDataListOptionsProps {
  state: DashboardState,
  handleChange: (state: DashboardState) => void
}

export default function SolveDataListOptions({ state, handleChange }: SolveDataListOptionsProps) {
  const handleChangeSortBy = (value: string) => {
    if (value === "date" || value === "time") {
      handleChange({
        ...state,
        page: 1,
        sortBy: value,
        sortDir: value === "date" ? "desc" : "asc"
      })
    }
  }

  const handleChangeSortDir = (value: string) => {
    if (value === "asc" || value === "desc") {
      handleChange({
        ...state,
        page: 1,
        sortDir: value
      })
    }
  }

  const handleChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    handleChange({
      ...state,
      page: 1,
      pageSize: Number(e.target.value)
    })
  }

  return (
    <div className={styles["list-options"]}>
      <GroupSelect />
      <h4 className={styles["list-option-container"]}>
        <span>Sort by:</span>
        <SegmentedControl
          value={state.sortBy}
          onChange={handleChangeSortBy}
          data={[
            { label: "solve date", value: "date" },
            { label: "solve time", value: "time" }
          ]}
        />
      </h4>
      <h4 className={styles["list-option-container"]}>
        <span>Order by:</span>
        <SegmentedControl
          value={state.sortDir}
          onChange={handleChangeSortDir}
          data={[
            { label: state.sortBy === "date" ? "oldest first" : "fastest first", value: "asc" },
            { label: state.sortBy === "date" ? "newest first" : "slowest first", value: "desc" },
          ]}
        />
      </h4>
      <h4 className={styles["list-option-container"]}>
        <span>Showing up to</span>
        <NativeSelect
          value={state.pageSize}
          onChange={handleChangePageSize}
          data={["5", "10", "25", "50", "100"]}
          style={{ width: "4rem" }}
        />
        <span>puzzles per page</span>
      </h4>
    </div>
  )
}