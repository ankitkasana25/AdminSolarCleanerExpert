"use client"

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material"
import { observer } from "mobx-react-lite"
import { orderStore } from "@/Store/order-store"
import type { Order } from "@/Store/order-store"
import { useState } from "react"

interface OrderDetailsCardProps {
  orderId: string
}

const OrderDetailsCard = observer(({ orderId }: OrderDetailsCardProps) => {
  const order = orderStore.selectedOrder
  const [newStatus, setNewStatus] = useState<Order["status"]>(order?.status || "pending")

  const handleStatusUpdate = async () => {
    await orderStore.updateOrderStatus(orderId, newStatus)
  }

  if (!order) return null

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
    <Card>
      <CardHeader title="Order Details" />
      <CardContent>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Order ID
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {order.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Status
              </Typography>
              <Chip label={order.status} color={getStatusColor(order.status)} sx={{ mt: 0.5 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                User ID
              </Typography>
              <Typography variant="body1">{order.userId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Service ID
              </Typography>
              <Typography variant="body1">{order.serviceId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Total Amount
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ${order.totalAmount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Partner Assigned
              </Typography>
              <Typography variant="body1">{order.partnerAssigned || "Unassigned"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Created
              </Typography>
              <Typography variant="body1">{new Date(order.createdAt).toLocaleString()}</Typography>
            </Grid>
            {order.completedAt && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
                <Typography variant="body1">{new Date(order.completedAt).toLocaleString()}</Typography>
              </Grid>
            )}
          </Grid>

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Update Status
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Order["status"])}
                label="New Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleStatusUpdate} disabled={orderStore.isLoading}>
              Update Status
            </Button>
          </Box>

          {order.notes && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Notes
                </Typography>
                <TextField fullWidth value={order.notes} multiline rows={4} InputProps={{ readOnly: true }} />
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
})

export default OrderDetailsCard
