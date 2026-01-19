import { makeAutoObservable } from "mobx"
import apiClient from "@/lib/api"

export interface MediaItem {
  id: string
  fileName: string
  url: string
  thumbnailUrl: string
  uploadedBy: string
  orderId: string
  uploadedAt: string
  status: "pending" | "approved" | "rejected"
  notes: string
}

interface MediaListResponse {
  media: MediaItem[]
  total: number
}

class MediaStore {
  media: MediaItem[] = []
  selectedMedia: MediaItem | null = null
  isLoading = false
  error: string | null = null
  uploadProgress = 0

  constructor() {
    makeAutoObservable(this)
    this.media = [
      {
        id: "M1",
        fileName: "panel_before.jpg",
        url: "https://picsum.photos/800/600?random=1",
        thumbnailUrl: "https://picsum.photos/200/200?random=1",
        uploadedBy: "Technician A",
        orderId: "ORD001",
        uploadedAt: new Date().toISOString(),
        status: "pending",
        notes: "",
      },
      {
        id: "M2",
        fileName: "panel_after.jpg",
        url: "https://picsum.photos/800/600?random=2",
        thumbnailUrl: "https://picsum.photos/200/200?random=2",
        uploadedBy: "Technician A",
        orderId: "ORD001",
        uploadedAt: new Date().toISOString(),
        status: "approved",
        notes: "Looks clean!",
      },
    ]
  }

  async fetchMedia(orderId?: string) {
    this.isLoading = true
    this.error = null
    try {
      const params = orderId ? `?orderId=${orderId}` : ""
      const response = await apiClient.get<MediaListResponse>(`/media${params}`)
      this.media = response.data.media
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to fetch media"
    } finally {
      this.isLoading = false
    }
  }

  async uploadMedia(file: File, orderId: string) {
    this.isLoading = true
    this.error = null
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("orderId", orderId)
      const response = await apiClient.post<MediaItem>("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      this.media.push(response.data)
      return response.data
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to upload media"
    } finally {
      this.isLoading = false
    }
  }

  async updateMediaStatus(id: string, status: MediaItem["status"], notes = "") {
    this.isLoading = true
    this.error = null
    try {
      const response = await apiClient.patch<MediaItem>(`/media/${id}`, {
        status,
        notes,
      })
      const index = this.media.findIndex((m) => m.id === id)
      if (index !== -1) {
        this.media[index] = response.data
      }
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to update media status"
    } finally {
      this.isLoading = false
    }
  }

  async deleteMedia(id: string) {
    this.isLoading = true
    this.error = null
    try {
      await apiClient.delete(`/media/${id}`)
      this.media = this.media.filter((m) => m.id !== id)
    } catch (error: any) {
      this.error = error.response?.data?.message || "Failed to delete media"
    } finally {
      this.isLoading = false
    }
  }
}

export const mediaStore = new MediaStore()
