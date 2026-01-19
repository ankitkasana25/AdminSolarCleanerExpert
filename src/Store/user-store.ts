import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface UserFilters {
  search: string
  status: "all" | "active" | "inactive"
  page: number
  limit: number
}

interface UserListResponse {
  users: AdminUser[]
  total: number
  page: number
  limit: number
}

class UserStore {
  users: AdminUser[] = []
  selectedUser: AdminUser | null = null
  isLoading = false
  error: string | null = null
  total = 0
  filters: UserFilters = {
    search: "",
    status: "all",
    page: 1,
    limit: 10,
  }

  constructor() {
    makeAutoObservable(this)
    this.users = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        address: "123 St, NY",
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "0987654321",
        address: "456 Av, LA",
        role: "partner",
        status: "inactive",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    this.total = 2
  }

  async fetchUsers() {
    this.isLoading = true
    this.error = null
    try {
      const params = new URLSearchParams({
        search: this.filters.search,
        status: this.filters.status,
        page: String(this.filters.page),
        limit: String(this.filters.limit),
      })
      const response = await apiClient.get<UserListResponse>(`/users?${params}`)
      this.users = response.data.users
      this.total = response.data.total
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch users"
    } finally {
      this.isLoading = false
    }
  }

  async fetchUserById(id: string) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.get<AdminUser>(`/users/${id}`)
      this.selectedUser = response.data
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch user"
    } finally {
      this.isLoading = false
    }
  }

  async updateUser(id: string, data: Partial<AdminUser>) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.put<AdminUser>(`/users/${id}`, data)
      this.selectedUser = response.data
      // Update in list
      const index = this.users.findIndex((u) => u.id === id)
      if (index !== -1) {
        this.users[index] = response.data
      }
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to update user"
    } finally {
      this.isLoading = false
    }
  }

  setFilters(filters: Partial<UserFilters>) {
    this.filters = { ...this.filters, ...filters }
  }

  resetFilters() {
    this.filters = { search: "", status: "all", page: 1, limit: 10 }
  }
}

export const userStore = new UserStore()
