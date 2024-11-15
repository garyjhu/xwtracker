import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Anchor, Box, Button, Center, Checkbox, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { FirebaseError } from "@firebase/util";
import LoginLayout from "./LoginLayout";
import { auth } from "../firebase-config";
import firebase from "firebase/compat";
import { sendPasswordResetEmail } from "@firebase/auth"
import { IconArrowLeft } from "@tabler/icons-react";

interface FormInput {
  email: string
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>()
  const { resetPassword } = useContext(AuthContext)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const title = "Forgot your password?"
  const subtitle = "Enter your email to get a password reset link."

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await resetPassword(data.email)
      setSuccess(true)
    }
    catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code
        if (errorCode === "auth/invalid-email") {
          setErrorMsg("Invalid email address.")
        }
        else if (errorCode === "auth/user-not-found") {
          setSuccess(true)
        }
        else {
          setErrorMsg("An error occurred. Please try again.")
        }
      }
    }
  }

  return (
    <LoginLayout title={title} subtitle={subtitle} errorMsg={errorMsg}>
      {success ? (
        <>
          <Text>
            A password reset link will be sent to this email if an account is registered under it.
          </Text>
          <Anchor component={Link} to={"/login"} size={"sm"}>
            <Center inline mt={"lg"}>
              <IconArrowLeft stroke={1.5} />
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Anchor>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            {...register("email", {
              required: true,
              maxLength: {
                value: 256,
                message: "Invalid email address."
              },
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address."
              }
            })}
            label={"Email"}
            error={errors.email?.message}
            required
          />
          <Group justify="space-between" mt="lg">
            <Anchor component={Link} to={"/login"} size={"sm"}>
              <Center inline>
                <IconArrowLeft stroke={1.5}/>
                <Box ml={5}>Back to the login page</Box>
              </Center>
            </Anchor>
            <Button type="submit">
              Reset password
            </Button>
          </Group>
        </form>
      )}
    </LoginLayout>
  )
}