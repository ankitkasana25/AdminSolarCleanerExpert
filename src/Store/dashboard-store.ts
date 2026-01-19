import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface DashboardKPI {
  totalUsers: number
  activePartners: number
  openOrders: number
  revenue: number
  recentOrders: Array<{
    id: string
    userId: string
    status: string
    amount: number
    createdAt: string
  }>
  recentQueries: Array<{
    id: string
    userId: string
    message: string
    status: string
    createdAt: string
  }>
}

class DashboardStore {
  kpi: DashboardKPI | null = null
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
    // Initialize with mock data for preview
    this.kpi = {
      totalUsers: 1450,
      activePartners: 85,
      openOrders: 42,
      revenue: 12500,
      recentOrders: [
        { id: "ORD001", userId: "U1", status: "completed", amount: 150, createdAt: new Date().toISOString() },
        { id: "ORD002", userId: "U2", status: "pending", amount: 200, createdAt: new Date().toISOString() },
        { id: "ORD003", userId: "U3", status: "in-progress", amount: 120, createdAt: new Date().toISOString() },
      ],
      recentQueries: [
        { id: "Q1", userId: "U1", message: "Help with panels", status: "pending", createdAt: new Date().toISOString() },
      ]
    }
  }

  async fetchDashboardData() {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.get<DashboardKPI>("/dashboard/kpi")
      this.kpi = response.data
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch dashboard data"
    } finally {
      this.isLoading = false
    }
  }
}

export const dashboardStore = new DashboardStore()
