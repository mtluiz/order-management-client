"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../lib/api"
import { User, AuthResponse } from "../types/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (token) {
          const response = await api.get("/auth/login")
          setUser(response.data.user)
        }
      } catch (error) {
        console.log(error)
        localStorage.removeItem("accessToken")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", { email, password })
      localStorage.setItem("accessToken", response.data.accessToken)
      setUser(response.data.user)
    } catch (error) {
      console.log(error)
      throw new Error("Invalid credentials")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", { name, email, password })
      localStorage.setItem("accessToken", response.data.accessToken)
      setUser(response.data.user)
    } catch (error) {
      console.log(error)
      throw new Error("Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
