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
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Solar Solutions Inc.",
        email: "contact@solarsolutions.com",
        phone: "1-800-SOLAR-00",
        address: "789 Texas Ave, Austin",
        role: "partner",
        status: "active",
        createdAt: new Date(Date.now() - 10000000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Green Energy Corp",
        email: "support@greenenergy.com",
        phone: "1-888-GREEN-11",
        address: "101 Eco Blvd, Seattle",
        role: "partner",
        status: "inactive",
        createdAt: new Date(Date.now() - 20000000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Alice Johnson",
        email: "alice@test.com",
        phone: "555-123-4567",
        address: "321 Maple Dr, SF",
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]
    this.total = 5
  }

  async fetchUsers() {
    this.isLoading = true
    this.error = null
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app we would fetch here:
      // const response = await apiClient.get<UserListResponse>(`/users?${params}`)
      // this.users = response.data.users
      // this.total = response.data.total

      // For now, keep the mock data stable
    } catch (error: any) {
      console.error("Failed to fetch users", error)
      // this.error = error.response?.data?.message || "Failed to fetch users"
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

  async deleteUser(id: string) {
    this.isLoading = true
    this.error = null
    try {
      await apiClient.delete(`/users/${id}`)
      this.users = this.users.filter((u) => u.id !== id)
      this.total -= 1
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to delete user"
      throw error // Re-throw to handle in component
    } finally {
      this.isLoading = false
    }
  }

  resetFilters() {
    this.filters = { search: "", status: "all", page: 1, limit: 10 }
  }
}

export const userStore = new UserStore()
