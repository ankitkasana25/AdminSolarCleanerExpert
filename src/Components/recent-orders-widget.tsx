"use client"

import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableRow, Chip } from "@mui/material"
import { observer } from "mobx-react-lite"
import { dashboardStore } from "@/Store/dashboard-store"

const RecentOrdersWidget = observer(() => {
  if (!dashboardStore.kpi) return null

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
      <CardHeader title="Recent Orders" />
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardStore.kpi.recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                </TableCell>
                <TableCell align="right">${order.amount}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})

export default RecentOrdersWidget
