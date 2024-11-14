import { Button } from "@mantine/core";
import { MouseEventHandler } from "react";

interface HeaderLinkProps {
  label: string,
  onClick: MouseEventHandler<HTMLButtonElement>
}

export default function HeaderLink({ label, onClick }: HeaderLinkProps) {
  return (
    <Button
      variant={"subtle"}
      onClick={onClick}
      color={"dark"}
      size={"lg"}
    >
      {label}
    </Button>
  )
}