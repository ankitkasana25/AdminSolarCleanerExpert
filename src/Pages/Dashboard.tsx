import { Grid, Typography, Box } from "@mui/material"
import { KPICard } from "@/Components/kpi-card"
import RecentOrdersWidget from "@/Components/recent-orders-widget"
import {
    People as PeopleIcon,
    ShoppingCart as OrdersIcon,
    AttachMoney as RevenueIcon,
    Handyman as PartnersIcon,
} from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { dashboardStore } from "@/Store/dashboard-store"

const Dashboard = observer(() => {
    const { kpi } = dashboardStore

    if (!kpi) return null

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "#1a1a1a" }}>
                Dashboard Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Total Users" value={kpi.totalUsers} icon={<PeopleIcon />} color="#1976d2" trend={12} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Active Partners" value={kpi.activePartners} icon={<PartnersIcon />} color="#2e7d32" trend={5} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Open Orders" value={kpi.openOrders} icon={<OrdersIcon />} color="#ed6c02" trend={-2} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Total Revenue" value={`₹${kpi.revenue}`} icon={<RevenueIcon />} color="#9c27b0" trend={18} />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <RecentOrdersWidget />
                </Grid>
                <Grid item xs={12} md={4}>
                    {/* Add more widgets here */}
                </Grid>
            </Grid>
        </Box>
    )
})

export default Dashboard
