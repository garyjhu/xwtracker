import { Alert, MantineColor } from "@mantine/core";
import { ReactNode, useState } from "react";

export interface DashboardBannerProps {
  color?: MantineColor,
  icon?: ReactNode,
  title?: string,
  visible?: boolean,
  withCloseButton?: boolean
  onClose?: () => void
}

export function DashboardBanner({ color, title, icon, visible, withCloseButton = true, onClose }: DashboardBannerProps) {
  const [_visible, setVisible] = useState<boolean>(true)
  onClose ??= () => setVisible(false)

  return (visible ?? _visible) && (
    <Alert
      variant={"light"}
      color={color}
      radius={"md"}
      icon={icon}
      title={title}
      withCloseButton={withCloseButton}
      styles={{
        root: {
          boxShadow: "var(--mantine-shadow-xs)"
        },
        title: {
          fontSize: "var(--mantine-font-size-md)",
        }
      }}
      mb={"sm"}
      onClose={onClose}
    >
    </Alert>
  )
}