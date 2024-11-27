import { useForm } from "react-hook-form"
import { Anchor, Button, Checkbox, Group, PasswordInput, TextInput } from "@mantine/core"
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginLayout from "./LoginLayout";
import { FirebaseError } from "@firebase/util";
import { AuthContext } from "../../auth";

interface FormInput {
  email: string
  password: string
}

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>()
  const { logIn } = useContext(AuthContext)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const navigate = useNavigate()

  const title = "Welcome back!"
  const subtitle = (
    <>
      Don&apos;t have an account?{" "}
      <Anchor size="sm" component={Link} to={"/signup"}>
        Sign up
      </Anchor>
    </>
  )

  const onSubmit = async (data: FormInput) => {
    try {
      await logIn(data.email, data.password)
      navigate("/")
    }
    catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code
        if (errorCode === "auth/invalid-email") {
          setErrorMsg("Invalid email address.")
        }
        else if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
          setErrorMsg("The email or password is incorrect.")
        }
        else if (errorCode === "auth/user-disabled") {
          setErrorMsg("This user has been disabled.")
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
              message: "Invalid email address."
            },
            pattern: {
              value:  /^\S+@\S+\.\S+$/,
              message: "Invalid email address."
            }
          })}
          label={"Email"}
          error={errors.email?.message}
          required
        />
        <PasswordInput
          {...register("password", {
            required: true,
            maxLength: {
              value: 256,
              message: "Invalid password."
            }
          })}
          label={"Password"}
          error={errors.password?.message}
          required
          mt={"md"}
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" styles={{ input: { cursor: "pointer" } }}/>
          <Anchor component={Link} to={"/forgot_password"} size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button type="submit" fullWidth mt={"xl"}>
          Log in
        </Button>
      </form>
    </LoginLayout>
  )
}