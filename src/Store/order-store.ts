import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface Order {
  id: string
  userId: string
  userName: string
  userAddress: string
  userPhone: string
  serviceId: string
  serviceName: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  totalAmount: number
  partnerAssigned: string | null
  createdAt: string
  scheduledDate: string
  timeSlot: string
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
        userName: "John Doe",
        userAddress: "123 Solar Street, Springfield",
        userPhone: "+1 555-123-4567",
        serviceId: "S1",
        serviceName: "Standard Cleaning",
        status: "completed",
        totalAmount: 150,
        partnerAssigned: "Technician A",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        scheduledDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        timeSlot: "09:00 AM - 11:00 AM",
        completedAt: new Date(Date.now() - 86400000 + 7200000).toISOString(),
        notes: "All good",
      },
      {
        id: "ORD002",
        userId: "U2",
        userName: "Jane Smith",
        userAddress: "456 Sunny Lane, Shelterville",
        userPhone: "+1 555-987-6543",
        serviceId: "S2",
        serviceName: "Deep Chemical Wash",
        status: "pending",
        totalAmount: 200,
        partnerAssigned: null,
        createdAt: new Date().toISOString(),
        scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        timeSlot: "02:00 PM - 04:00 PM",
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
      // Simulate API call by finding in local mock data
      // In real app: const response = await apiClient.get<Order>(`/orders/${id}`)
      const order = this.orders.find((o) => o.id === id)
      if (order) {
        this.selectedOrder = order
      } else {
        // Fallback for demo if id not found in mock
        this.selectedOrder = null
        this.error = "Order not found"
      }
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
