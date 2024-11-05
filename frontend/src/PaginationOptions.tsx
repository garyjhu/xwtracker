import { Group, NativeSelect } from "@mantine/core";
import { DashboardState, DashboardStateEventHandler } from "./Dashboard";
import { ChangeEvent } from "react";

type PaginationOptionsProps = Pick<DashboardState, "pageSize"> & {
  onChange: DashboardStateEventHandler
}

export default function PaginationOptions({ pageSize, onChange }: PaginationOptionsProps) {
  const handleChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      page: 1,
      pageSize: Number(e.target.value)
    })
  }

  return (
    <Group gap={"xs"}>
      <span>Showing up to</span>
      <NativeSelect
        value={pageSize}
        onChange={handleChangePageSize}
        data={["5", "10", "25", "50", "100"]}
        style={{ width: "4rem" }}
      />
      <span>puzzles per page</span>
    </Group>
  )
}