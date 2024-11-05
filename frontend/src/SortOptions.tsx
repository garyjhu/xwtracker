import { Group, SegmentedControl } from "@mantine/core";
import { DashboardState, DashboardStateEventHandler } from "./Dashboard";

type SolveDataListOptionsProps = Pick<DashboardState, "sortBy" | "sortDir"> & {
  onChange: DashboardStateEventHandler
}

export default function SortOptions({ sortBy, sortDir, onChange }: SolveDataListOptionsProps) {
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

  return (
    <Group gap={"2rem"}>
      <Group>
        <span>Sort by:</span>
        <SegmentedControl
          value={sortBy}
          onChange={handleChangeSortBy}
          data={[
            { label: "solve date", value: "date" },
            { label: "solve time", value: "time" }
          ]}
        />
      </Group>
      <Group>
        <span>Order by:</span>
        <SegmentedControl
          value={sortDir}
          onChange={handleChangeSortDir}
          data={[
            { label: sortBy === "date" ? "oldest first" : "fastest first", value: "asc" },
            { label: sortBy === "date" ? "newest first" : "slowest first", value: "desc" },
          ]}
        />
      </Group>
    </Group>
  )
}