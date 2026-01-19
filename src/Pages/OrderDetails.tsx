"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    Stack,
    CircularProgress,
    Alert,
} from "@mui/material"
import {
    ArrowBack as ArrowBackIcon,
    CalendarMonth,
    AccessTime,
    Person,
    LocationOn,
    CleaningServices,
    Notes,
    Timelapse,
} from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { orderStore } from "@/Store/order-store"

const OrderDetailsPage = observer(() => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [timeLeft, setTimeLeft] = useState("")

    useEffect(() => {
        if (id) {
            orderStore.fetchOrderById(id)
        }
    }, [id])

    // Countdown timer logic
    useEffect(() => {
        if (!orderStore.selectedOrder?.scheduledDate) return

        const calculateTimeLeft = () => {
            const scheduledTime = new Date(orderStore.selectedOrder!.scheduledDate).getTime()
            const now = new Date().getTime()
            const difference = scheduledTime - now

            if (difference <= 0) {
                setTimeLeft("Service time has passed")
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

                let timeString = ""
                if (days > 0) timeString += `${days} days `
                if (hours > 0) timeString += `${hours} hr `
                timeString += `${minutes} min`

                setTimeLeft(timeString)
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

        return () => clearInterval(timer)
    }, [orderStore.selectedOrder])

    if (orderStore.isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (orderStore.error || !orderStore.selectedOrder) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">{orderStore.error || "Order not found"}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/orders")} sx={{ mt: 2 }}>
                    Back to Orders
                </Button>
            </Box>
        )
    }

    const order = orderStore.selectedOrder

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "success";
            case "in-progress": return "info";
            case "pending": return "warning";
            case "cancelled": return "error";
            default: return "default";
        }
    }

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/orders")}>
                    Back
                </Button>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Order Details #{order.id}
                </Typography>
                <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status) as any}
                    sx={{ fontWeight: "bold" }}
                />
            </Box>

            <Grid container spacing={3}>
                {/* Main Details */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {/* Service & Schedule Card */}
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CleaningServices color="primary" /> Service Information
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Service Name</Typography>
                                        <Typography variant="body1" fontWeight="medium">{order.serviceName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Service ID</Typography>
                                        <Typography variant="body1">{order.serviceId}</Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarMonth color="primary" /> Schedule & Timing
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2" color="textSecondary">Scheduled Date</Typography>
                                        <Typography variant="body1">{new Date(order.scheduledDate).toLocaleDateString()}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2" color="textSecondary">Time Slot</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTime fontSize="small" color="action" /> {order.timeSlot}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2" color="textSecondary">Remaining Time</Typography>
                                        <Typography variant="body1" color="secondary.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Timelapse fontSize="small" /> {timeLeft}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* User Details Card */}
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person color="primary" /> Customer Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                                        <Typography variant="body1">{order.userName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                                        <Typography variant="body1">{order.userPhone}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOn fontSize="small" color="action" /> {order.userAddress}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Sidebar Summary */}
                <Grid item xs={12} md={4}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                                Order Summary
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography color="textSecondary">Order Created</Typography>
                                <Typography variant="body2">{new Date(order.createdAt).toLocaleDateString()}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography color="textSecondary">Partner Assigned</Typography>
                                <Typography variant="body2">{order.partnerAssigned || "Unassigned"}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                                <Typography variant="h6">Total Amount</Typography>
                                <Typography variant="h5" color="primary.main" fontWeight="bold">₹{order.totalAmount}</Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {order.notes && (
                        <Card elevation={2} sx={{ mt: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Notes color="primary" /> Notes
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {order.notes}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
})

export default OrderDetailsPage
