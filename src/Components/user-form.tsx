"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material"
import { observer } from "mobx-react-lite"
import type { AdminUser } from "@/Store/user-store"
import { userStore } from "@/Store/user-store"

interface UserFormProps {
  userId?: string
  onSuccess?: () => void
}

const UserForm = observer(({ userId, onSuccess }: UserFormProps) => {
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "viewer",
    status: "active",
  })

  useEffect(() => {
    if (userId) {
      userStore.fetchUserById(userId)
    }
  }, [userId])

  useEffect(() => {
    if (userStore.selectedUser) {
      setFormData(userStore.selectedUser)
    }
  }, [userStore.selectedUser])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userId) {
      await userStore.updateUser(userId, formData)
    } else {
      // Create new user - would require separate endpoint
      console.log("Create user", formData)
    }
    onSuccess?.()
  }

  if (userStore.isLoading && userId) {
    return <CircularProgress />
  }

  return (
    <Card>
      <CardContent>
        {userStore.error && <Alert severity="error">{userStore.error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              multiline
              rows={3}
            />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select value={formData.role} onChange={(e) => handleChange("role", e.target.value)} label="Role">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} onChange={(e) => handleChange("status", e.target.value)} label="Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" type="submit" disabled={userStore.isLoading} sx={{ mt: 2 }}>
              {userStore.isLoading ? <CircularProgress size={24} /> : userId ? "Update User" : "Create User"}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
})

export default UserForm
