import { SubmitHandler, useForm } from "react-hook-form"
import { Button, PasswordInput, TextInput } from "@mantine/core"
import axios from "axios"
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

interface LoginFormInput {
  email: string
  password: string
}

function Login() {
  const { register, handleSubmit } = useForm<LoginFormInput>()
  const { user, loading, logIn } = useContext(AuthContext)
  const navigate = useNavigate()

  if (loading) return null

  if (user) return <Navigate to={"/"} />

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await logIn(data.email, data.password)
      navigate("/")
    }
    catch (error) {
      console.log("error")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput 
        {...register("email", {
          required: true,
          maxLength: 256,
          pattern: /^\S+@\S+\.\S+$/
        })}
      />
      <PasswordInput
        {...register("password", {
          required: true,
          maxLength: 256,
        })}
      />
      <Button type="submit">
        Log in
      </Button>
    </form>
  )
}

export default Login