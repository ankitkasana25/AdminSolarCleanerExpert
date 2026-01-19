import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface ContactQuery {
  id: string
  userId: string
  userName: string
  message: string
  attachments: string[]
  status: "new" | "in-progress" | "resolved"
  assignedTo: string | null
  createdAt: string
  updatedAt: string
}

interface ContactListResponse {
  queries: ContactQuery[]
  total: number
}

class ContactStore {
  queries: ContactQuery[] = []
  selectedQuery: ContactQuery | null = null
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
    this.queries = [
      {
        id: "Q1",
        userId: "U1",
        userName: "John Doe",
        message: "Need help with cleaning schedule",
        attachments: [],
        status: "new",
        assignedTo: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "Q2",
        userId: "U2",
        userName: "Jane Smith",
        message: "Panel damage report",
        attachments: [],
        status: "in-progress",
        assignedTo: "Admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  async fetchQueries() {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.get<ContactListResponse>("/contact-queries")
      this.queries = response.data.queries
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch queries"
    } finally {
      this.isLoading = false
    }
  }

  async updateQueryStatus(id: string, status: ContactQuery["status"]) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.patch<ContactQuery>(`/contact-queries/${id}`, {
        status,
      })
      const index = this.queries.findIndex((q) => q.id === id)
      if (index !== -1) {
        this.queries[index] = response.data
      }
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to update query status"
    } finally {
      this.isLoading = false
    }
  }

  async assignQuery(id: string, adminId: string) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.patch<ContactQuery>(`/contact-queries/${id}`, {
        assignedTo: adminId,
      })
      const index = this.queries.findIndex((q) => q.id === id)
      if (index !== -1) {
        this.queries[index] = response.data
      }
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to assign query"
    } finally {
      this.isLoading = false
    }
  }
}

export const contactStore = new ContactStore()
