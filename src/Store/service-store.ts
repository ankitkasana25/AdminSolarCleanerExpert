import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface Service {
  id: string
  name: string
  category: string
  price: number
  duration: number
  tags: string[]
  isActive: boolean
  images: string[]
  options: ServiceOption[]
  createdAt: string
  updatedAt: string
}

export interface ServiceOption {
  id: string
  name: string
  price: number
}

interface ServiceListResponse {
  services: Service[]
  total: number
}

class ServiceStore {
  services: Service[] = []
  selectedService: Service | null = null
  isLoading = false
  error: string | null = null
  categories: string[] = []

  constructor() {
    makeAutoObservable(this)
    this.services = [
      {
        id: "S1",
        name: "Standard Cleaning",
        category: "Residential",
        price: 99,
        duration: 60,
        tags: ["popular", "eco-friendly"],
        isActive: true,
        images: [],
        options: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "S2",
        name: "Deep Chemical Wash",
        category: "Commercial",
        price: 249,
        duration: 120,
        tags: ["heavy-duty"],
        isActive: true,
        images: [],
        options: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  async fetchServices() {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.get<ServiceListResponse>("/services")
      this.services = response.data.services
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch services"
    } finally {
      this.isLoading = false
    }
  }

  async fetchServiceById(id: string) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.get<Service>(`/services/${id}`)
      this.selectedService = response.data
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch service"
    } finally {
      this.isLoading = false
    }
  }

  async createService(data: Partial<Service>) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.post<Service>("/services", data)
      this.services.push(response.data)
      return response.data
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to create service"
    } finally {
      this.isLoading = false
    }
  }

  async updateService(id: string, data: Partial<Service>) {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.put<Service>(`/services/${id}`, data)
      this.selectedService = response.data
      const index = this.services.findIndex((s) => s.id === id)
      if (index !== -1) {
        this.services[index] = response.data
      }
      return response.data
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to update service"
    } finally {
      this.isLoading = false
    }
  }

  async deleteService(id: string) {
    this.isLoading = true
    this.error = null
    try {
      await apiClient.delete(`/services/${id}`)
      this.services = this.services.filter((s) => s.id !== id)
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to delete service"
    } finally {
      this.isLoading = false
    }
  }
}

export const serviceStore = new ServiceStore()
