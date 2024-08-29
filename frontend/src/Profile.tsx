import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNytSolveData } from "./api";
import { addDays } from "date-fns";

interface ProfileFormValues {
  nytSCookie: string
}

export default function Profile() {
  const { register, handleSubmit } = useForm<ProfileFormValues>()
  const { user} = useContext(AuthContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ startDate, endDate }: { startDate: Date, endDate: Date }) => updateNytSolveData(user!, startDate, endDate),
    onSuccess: () => queryClient.invalidateQueries()
  })

  const onSubmit = async (data: ProfileFormValues) => {
    const idToken = user?.getIdToken(true)
    await axios.put("http://localhost:8080/cookie", data.nytSCookie, {
      headers: {
        Authorization: "bearer " + idToken
      }
    })
    const firstNytPublishDate = new Date(1993, 11, 21)
    let startDate = addDays(new Date(), -29)
    let endDate = new Date()
    while (endDate >= firstNytPublishDate) {
      mutation.mutate({ startDate, endDate })
      startDate = addDays(startDate, -30)
      endDate = addDays(endDate, -30)
    }
    navigate("/dashboard")
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