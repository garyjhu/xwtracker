import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "@mantine/core";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNytSolveData } from "./api";
import { addDays, startOfMonth } from "date-fns";

interface ProfileFormValues {
  nytSCookie: string
}

export default function Profile() {
  const { register, handleSubmit } = useForm<ProfileFormValues>()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ startDate, endDate }: { startDate: Date, endDate: Date }) => updateNytSolveData(user!, startDate, endDate),
    onSuccess: () => queryClient.invalidateQueries()
  })

  const onSubmit = async (data: ProfileFormValues) => {
    const idToken = await user?.getIdToken(true)
    await axios.put("http://localhost:8080/user/cookie", data.nytSCookie, {
      headers: {
        Authorization: "bearer " + idToken,
        "Content-Type": "application/json"
      }
    })
    const firstNytPublishDate = new Date(2024, 8, 21)
    let endDate = new Date()
    while (endDate >= firstNytPublishDate) {
      let startDate = startOfMonth(endDate)
      mutation.mutate({ startDate, endDate })
      endDate = addDays(startDate, -1)
    }
    navigate("/")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        {...register("nytSCookie")}
      />
      <Button type="submit">
        Submit
      </Button>
    </form>
  )
}