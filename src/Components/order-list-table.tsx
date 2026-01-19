"use client"

import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from "@mui/material"
import { Visibility as EyeIcon } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"
import { orderStore } from "@/Store/order-store"

const OrderListTable = observer(() => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    orderStore.setFilters({ page: newPage + 1 })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    orderStore.setFilters({ limit: Number.parseInt(event.target.value, 10), page: 1 })
  }

  const handleStatusChange = (value: string) => {
    orderStore.setFilters({ status: value as any, page: 1 })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "in-progress":
        return "info"
      case "pending":
        return "warning"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField placeholder="Search by Order ID..." size="small" sx={{ flex: 1, minWidth: 250 }} />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={orderStore.filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            label="Status"
            size="small"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Amount
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Partner</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderStore.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                </TableCell>
                <TableCell align="right">₹{order.totalAmount}</TableCell>
                <TableCell>{order.partnerAssigned || "-"}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link to={`/orders/${order.id}`}>
                    <IconButton size="small" title="View">
                      <EyeIcon fontSize="small" />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={orderStore.total}
          rowsPerPage={orderStore.filters.limit}
          page={orderStore.filters.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  )
})

export default OrderListTable
