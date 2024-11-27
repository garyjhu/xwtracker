import { Container, LoadingOverlay, Paper, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ReactNode, useContext } from "react";

import { AuthContext } from "../../auth";

interface LoginLayoutProps {
  title: ReactNode,
  subtitle: ReactNode,
  errorMsg: string | null,
  children: ReactNode
}

export default function LoginLayout({ title, subtitle, errorMsg, children }: LoginLayoutProps) {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  if (!loading && user) navigate("/")

  return (
    <Container size={"xs"} my={40}>
      <Title ta="center">
        {title}
      </Title>
      {subtitle && (
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          {subtitle}
        </Text>
      )}
      <Paper withBorder shadow="sm" p={30} mt={30} radius="md" pos={"relative"}>
        <LoadingOverlay visible={loading} loaderProps={{ type: "bars" }} />
        {errorMsg && (
          <Text c={"red.8"} size={"sm"} mb={10}>
            {errorMsg}
          </Text>
        )}
        {children}
      </Paper>
    </Container>
  )
}