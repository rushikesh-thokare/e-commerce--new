"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  access_token?: string
}

interface AuthContextType {
  user: User | null
  isLoginOpen: boolean
  login: (userData: User) => void
  logout: () => void
  toggleLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  }, [user, mounted])

  const login = (userData: User) => {
  setUser(userData)
  setIsLoginOpen(false)
  }

  const logout = () => {
    setUser(null)
    // Clear related data
    localStorage.removeItem("cart")
    localStorage.removeItem("wishlist")
  }

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoginOpen,
        login,
        logout,
        toggleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
