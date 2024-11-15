import { useForm } from "react-hook-form"
import {
  Anchor,
  Button,
  PasswordInput,
  TextInput
} from "@mantine/core"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { FirebaseError } from "@firebase/util"
import LoginLayout from "./LoginLayout";

interface FormInput {
  email: string
  username: string
  password: string
  confirmPassword : string
}

function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>()
  const { createUser } = useContext(AuthContext)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const navigate = useNavigate()

  const title = "Create an account"
  const subtitle = (
    <>
      Already have an account?{" "}
      <Anchor size="sm" component={Link} to={"/login"}>
        Log in
      </Anchor>
    </>
  )

  const onSubmit = async (data: FormInput) => {
    try {
      await createUser(data.email, data.password)
      navigate("/profile")
    }
    catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code
        if (errorCode === "auth/email-already-in-use") {
          setErrorMsg("This email is already in use.")
        }
        else if (errorCode === "auth/invalid-email") {
          setErrorMsg("Invalid email address.")
        }
        else {
          setErrorMsg("An error occurred. Please try again.")
        }
      }
    }
  }

  return (
    <LoginLayout title={title} subtitle={subtitle} errorMsg={errorMsg}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          {...register("email", {
            required: true,
            maxLength: {
              value: 256,
              message: "Invalid email address"
            },
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email address"
            },
          })}
          label={"Email"}
          error={errors.email?.message}
          required
        />
        <TextInput
          {...register("username", {
            required: true,
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long."
            },
            maxLength: {
              value: 20,
              message: "Username must not exceed 20 characters in length."
            },
            pattern: {
              value: /^\w+$/,
              message: "Username can only contain letters, numbers, and underscores."
            },
          })}
          label={"Username"}
          error={errors.username?.message}
          required
          mt={"md"}
        />
        <PasswordInput
          {...register("password", {
            required: true,
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long."
            },
            maxLength: {
              value: 256,
              message: "Password must not exceed 256 characters in length."
            }
          })}
          label={"Password"}
          error={errors.password?.message}
          required
          mt={"md"}
        />
        <PasswordInput
          {...register("confirmPassword", {
            required: true,
            validate: (value, formValues) => value === formValues.password || "Passwords do not match."
          })}
          label={"Retype password"}
          error={errors.confirmPassword?.message}
          required
          mt={"md"}
        />
        <Button type="submit" fullWidth mt={"xl"}>
          Sign up
        </Button>
      </form>
    </LoginLayout>
  )
}

export default Signup