import { createContext, ReactNode, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { auth } from "./firebase-config";
import { AuthContextValues } from "./types";
import { sendPasswordResetEmail } from "@firebase/auth";

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  loading: true,
  createUser: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  logIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  resetPassword: (email) => sendPasswordResetEmail(auth, email),
  logOut: () => signOut(auth)
})

interface AuthState {
  user: User | null
  loading: boolean
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  const handleError = (error: unknown) => {
    setState({ ...state, loading: false })
    throw error
  }

  const createUser = (email: string, password: string) => {
    setState({ ...state, loading: true })
    return createUserWithEmailAndPassword(auth, email, password).catch(handleError)
  }

  const logIn = (email: string, password: string) => {
    setState({ ...state, loading: true })
    return signInWithEmailAndPassword(auth, email, password).catch(handleError)
  }

  const resetPassword = (email: string) => {
    setState({ ...state, loading: true })
    return sendPasswordResetEmail(auth, email).finally(() => setState({ ...state, loading: false }))
  }

  const logOut = () => {
    setState({ ...state, loading: true })
    return signOut(auth).catch(handleError)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setState({ user: currentUser, loading: false })
    })
    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ ...state, createUser, logIn, resetPassword, logOut }}>
    {children}
  </AuthContext.Provider>
}