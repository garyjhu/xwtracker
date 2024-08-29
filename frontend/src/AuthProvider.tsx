import { createContext, ReactNode, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { auth } from "./firebase-config";
import { AuthContextValues } from "./types";

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  loading: true,
  createUser: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  logIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logOut: () => signOut(auth)
})

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const createUser = (email: string, password: string) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const logIn = (email: string, password: string) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logOut = () => {
    setLoading(true)
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })
    console.log("hello")
    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading, createUser, logIn, logOut }}>
    {children}
  </AuthContext.Provider>
}