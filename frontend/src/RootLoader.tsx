import { LoaderFunction, redirect } from "react-router-dom"
import { auth } from "./firebase-config"
import axios from "axios"

interface UserData {
  email: string,
  username: string,
}

async function RootLoader(): Promise<UserData | Response> {
  let userData: UserData | undefined
  await auth.onAuthStateChanged(async (user) => {
    if (user) {
      const idToken = user.getIdToken(true)
      axios.get<UserData>("https://localhost:8080/getUserData", {
        headers: {
          Authorization: "Bearer " + idToken
        }
      }).then(response => userData = response.data)
    }
    else {
      return redirect("/login")
    }
  })
  return userData || redirect("/login")
}

export { UserData }
export default RootLoader satisfies LoaderFunction