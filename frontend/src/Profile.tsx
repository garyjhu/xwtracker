import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Anchor, Button, Container, Group, Text, TextInput, Title } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCookie, updateNytSolveData } from "./api";
import { addDays, startOfMonth } from "date-fns";
import { useAuthenticatedUser } from "./hooks";

interface ProfileFormValues {
  cookie: string
}

export default function Profile() {
  const { register, handleSubmit } = useForm<ProfileFormValues>()
  const user = useAuthenticatedUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ startDate, endDate }: { startDate: Date, endDate: Date }) => updateNytSolveData(user, startDate, endDate),
    onSuccess: () => queryClient.invalidateQueries()
  })

  const onSubmit = async (data: ProfileFormValues) => {
    await setCookie(user, data.cookie)
    const firstNytPublishDate = new Date(2024, 10, 1)
    let endDate = addDays(new Date(), 1)
    while (endDate >= firstNytPublishDate) {
      let startDate = startOfMonth(endDate)
      mutation.mutate({ startDate, endDate })
      endDate = addDays(startDate, -1)
    }
    navigate("/")
  }

  return (
    <Container>
      <Title>Connect to your New York Times account</Title>
      <Text mt={"sm"}>
        If you are subscribed to NYT Games, you can connect your xwtracker account to your
        NYT account by entering your NYT login token below. See{" "}
        <Anchor href={"https://xwstats.com/link"}>here</Anchor>
        {" "}for instructions on getting the token.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group mt={"sm"}>
          <TextInput
            {...register("cookie")}
            placeholder={"Enter your NYT login token here"}
            style={{ flexGrow: 1 }}
          />
          <Button type="submit">
            Connect
          </Button>
        </Group>
      </form>
    </Container>
  )
}