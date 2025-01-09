import { createContext } from "react";
import { AuthContextValues } from "../utils/types";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase-config";

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  loading: true,
  createUser: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  logIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  resetPassword: (email) => sendPasswordResetEmail(auth, email),
  logOut: () => signOut(auth)
})