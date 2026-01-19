import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "support" | "viewer"
  createdAt: string
}

export interface LoginResponse {
  token: string
  user: User
}

class AuthStore {
  user: User | null = null
  token: string | null = null
  isLoading = false
  error: string | null = null
  isAuthenticated = false

  constructor() {
    makeAutoObservable(this)
    this.initializeFromStorage()
  }

  initializeFromStorage() {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken")
      const storedUser = localStorage.getItem("authUser")
      if (storedToken && storedUser) {
        this.token = storedToken
        this.user = JSON.parse(storedUser)
        this.isAuthenticated = true
      }
    }
  }

  async login(email: string, password: string) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      })
      const { token, user } = response.data
      this.token = token
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem("authToken", token)
      localStorage.setItem("authUser", JSON.stringify(user))
    } catch (error: any) {
      this.error = error.response?.data?.message || "Login failed"
      this.isAuthenticated = false
    } finally {
      this.isLoading = false
    }
  }

  logout() {
    this.user = null
    this.token = null
    this.isAuthenticated = false
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
  }

  hasRole(role: string | string[]) {
    if (!this.user) return false
    if (Array.isArray(role)) {
      return role.includes(this.user.role)
    }
    return this.user.role === role
  }
}

export const authStore = new AuthStore()
