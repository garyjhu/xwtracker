import { createContext } from "react";
import { AuthContextValues } from "../utils/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { sendPasswordResetEmail } from "@firebase/auth";

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  loading: true,
  createUser: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  logIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  resetPassword: (email) => sendPasswordResetEmail(auth, email),
  logOut: () => signOut(auth)
})