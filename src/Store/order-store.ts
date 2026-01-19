import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface Order {
  id: string
  userId: string
  serviceId: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  totalAmount: number
  partnerAssigned: string | null
  createdAt: string
  completedAt: string | null
  notes: string
}

export interface OrderFilters {
  status: "all" | "pending" | "in-progress" | "completed" | "cancelled"
  startDate: string
  endDate: string
  partnerId: string
  page: number
  limit: number
}

interface OrderListResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
}

class OrderStore {
  orders: Order[] = []
  selectedOrder: Order | null = null
  isLoading = false
  error: string | null = null
  total = 0
  filters: OrderFilters = {
    status: "all",
    startDate: "",
    endDate: "",
    partnerId: "",
    page: 1,
    limit: 10,
  }

  constructor() {
    makeAutoObservable(this)
    this.orders = [
      {
        id: "ORD001",
        userId: "U1",
        serviceId: "S1",
        status: "completed",
        totalAmount: 150,
        partnerAssigned: "Technician A",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        notes: "All good",
      },
      {
        id: "ORD002",
        userId: "U2",
        serviceId: "S2",
        status: "pending",
        totalAmount: 200,
        partnerAssigned: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        notes: "Urgent",
      },
    ]
    this.total = 2
  }

  async fetchOrders() {
    this.isLoading = true
    this.error = null
    try {
      const params = new URLSearchParams({
        status: this.filters.status,
        startDate: this.filters.startDate,
        endDate: this.filters.endDate,
        partnerId: this.filters.partnerId,
        page: String(this.filters.page),
        limit: String(this.filters.limit),
      })
      const response = await apiClient.get<OrderListResponse>(`/orders?${params}`)
      this.orders = response.data.orders
      this.total = response.data.total
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch orders"
    } finally {
      this.isLoading = false
    }
  }

  async fetchOrderById(id: string) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`)
      this.selectedOrder = response.data
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch order"
    } finally {
      this.isLoading = false
    }
  }

  async updateOrderStatus(id: string, status: Order["status"]) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.patch<Order>(`/orders/${id}`, { status })
      this.selectedOrder = response.data
      const index = this.orders.findIndex((o) => o.id === id)
      if (index !== -1) {
        this.orders[index] = response.data
      }
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to update order"
    } finally {
      this.isLoading = false
    }
  }

  setFilters(filters: Partial<OrderFilters>) {
    this.filters = { ...this.filters, ...filters }
  }
}

export const orderStore = new OrderStore()
