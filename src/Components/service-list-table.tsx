"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Switch,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as EyeIcon } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"
import { serviceStore } from "@/Store/service-store"

const ServiceListTable = observer(() => {
  const handleToggleActive = async (service: any) => {
    await serviceStore.updateService(service.id, { isActive: !service.isActive })
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await serviceStore.deleteService(id)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">
              Price
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Active</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceStore.services.map((service) => (
            <TableRow key={service.id}>
              <TableCell sx={{ fontWeight: "bold" }}>{service.name}</TableCell>
              <TableCell>
                <Chip label={service.category} size="small" variant="outlined" />
              </TableCell>
              <TableCell align="right">${service.price}</TableCell>
              <TableCell>{service.duration} mins</TableCell>
              <TableCell>
                <Switch
                  checked={service.isActive}
                  onChange={() => handleToggleActive(service)}
                  disabled={serviceStore.isLoading}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Link to={`/services/${service.id}`}>
                    <IconButton size="small" title="View">
                      <EyeIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  <Link to={`/services/${service.id}/edit`}>
                    <IconButton size="small" title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  <IconButton
                    size="small"
                    title="Delete"
                    onClick={() => handleDelete(service.id)}
                    disabled={serviceStore.isLoading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
})

export default ServiceListTable
