import { SubmitHandler, useForm } from "react-hook-form"
import { Button, PasswordInput, TextInput } from "@mantine/core"
import { auth } from "./firebase-config"
import axios from "axios"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { Navigate, useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

interface SignupFormValues {
  email: string
  username: string
  password: string
  confirmPassword : string
}

function Signup() {
  const { register, handleSubmit } = useForm<SignupFormValues>()
  const { user, loading, createUser } = useContext(AuthContext)
  const navigate = useNavigate()

  if (loading) return null

  if (user) return <Navigate to={"/"} />

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await createUser(data.email, data.password)
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
      <TextInput 
        {...register("username", {
          required: true,
          minLength: 3,
          maxLength: 20,
          pattern: /^\w+$/
        })}
      />
      <PasswordInput
        {...register("password", {
          required: true,
          minLength: 8,
          maxLength: 256,
        })}
      />
      <PasswordInput 
        {...register("confirmPassword", {
          required: true,
          validate: (value, formValues) => value === formValues.password
        })}
      />
      <Button type="submit">
        Submit
      </Button>
    </form>
  )
}

export default Signup