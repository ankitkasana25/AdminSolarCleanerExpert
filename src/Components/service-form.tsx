"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Box,
  Chip,
  FormControlLabel,
  Switch,
  Grid,
  IconButton,
  Typography,
} from "@mui/material"
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import type { Service, ServiceOption } from "@/Store/service-store"
import { serviceStore } from "@/Store/service-store"

interface ServiceFormProps {
  serviceId?: string
  onSuccess?: () => void
}

const ServiceForm = observer(({ serviceId, onSuccess }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    category: "",
    price: 0,
    duration: 60,
    tags: [],
    isActive: true,
    images: [],
    options: [],
  })

  const [tagInput, setTagInput] = useState("")
  const [optionName, setOptionName] = useState("")
  const [optionPrice, setOptionPrice] = useState("")

  useEffect(() => {
    if (serviceId) {
      serviceStore.fetchServiceById(serviceId)
    }
  }, [serviceId])

  useEffect(() => {
    if (serviceStore.selectedService) {
      setFormData(serviceStore.selectedService)
    }
  }, [serviceStore.selectedService])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }))
  }

  const handleAddOption = () => {
    if (optionName.trim() && optionPrice) {
      const newOption: ServiceOption = {
        id: `temp_${Date.now()}`,
        name: optionName,
        price: Number.parseFloat(optionPrice),
      }
      setFormData((prev) => ({
        ...prev,
        options: [...(prev.options || []), newOption],
      }))
      setOptionName("")
      setOptionPrice("")
    }
  }

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (serviceId) {
      await serviceStore.updateService(serviceId, formData)
    } else {
      await serviceStore.createService(formData)
    }
    onSuccess?.()
  }

  if (serviceStore.isLoading && serviceId) {
    return <CircularProgress />
  }

  return (
    <Card>
      <CardContent>
        {serviceStore.error && <Alert severity="error">{serviceStore.error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={formData.price}
                  onChange={(e) => handleChange("price", Number.parseFloat(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", Number.parseInt(e.target.value))}
                  required
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive || false}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
              }
              label="Active"
            />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.tags?.map((tag, index) => (
                  <Chip key={index} label={tag} onDelete={() => handleRemoveTag(index)} variant="outlined" />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Service Options
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Option Name"
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Price"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={optionPrice}
                    onChange={(e) => setOptionPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button fullWidth variant="outlined" onClick={handleAddOption}>
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>

              <Box>
                {formData.options?.map((option, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption">${option.price}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => handleRemoveOption(index)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            <Button variant="contained" type="submit" disabled={serviceStore.isLoading} sx={{ mt: 2 }}>
              {serviceStore.isLoading ? (
                <CircularProgress size={24} />
              ) : serviceId ? (
                "Update Service"
              ) : (
                "Create Service"
              )}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
})

export default ServiceForm

