import styles from "./SolveDataListOptions.module.css";
import { NativeSelect, SegmentedControl } from "@mantine/core";
import { DashboardState, DashboardStateEventHandler } from "./Dashboard";
import { ChangeEvent } from "react";

type SolveDataListOptionsProps = Pick<DashboardState, "pageSize" | "sortBy" | "sortDir"> & {
  onChange: DashboardStateEventHandler
}

export default function SolveDataListOptions({ pageSize, sortBy, sortDir, onChange }: SolveDataListOptionsProps) {
  const handleChangeSortBy = (value: string) => {
    if (value === "date" || value === "time") {
      onChange({
        page: 1,
        sortBy: value,
        sortDir: value === "date" ? "desc" : "asc"
      })
    }
  }

  const handleChangeSortDir = (value: string) => {
    if (value === "asc" || value === "desc") {
      onChange({
        page: 1,
        sortDir: value
      })
    }
  }

  const handleChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      page: 1,
      pageSize: Number(e.target.value)
    })
  }

  return (
    <div className={styles["list-options"]}>
      <h4 className={styles["list-option-container"]}>
        <span>Sort by:</span>
        <SegmentedControl
          value={sortBy}
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
          value={sortDir}
          onChange={handleChangeSortDir}
          data={[
            { label: sortBy === "date" ? "oldest first" : "fastest first", value: "asc" },
            { label: sortBy === "date" ? "newest first" : "slowest first", value: "desc" },
          ]}
        />
      </h4>
      <h4 className={styles["list-option-container"]}>
        <span>Showing up to</span>
        <NativeSelect
          value={pageSize}
          onChange={handleChangePageSize}
          data={["5", "10", "25", "50", "100"]}
          style={{ width: "4rem" }}
        />
        <span>puzzles per page</span>
      </h4>
    </div>
  )
}