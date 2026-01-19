import { Typography, Box } from "@mui/material"
import OrderListTable from "@/Components/order-list-table"

const OrdersPage = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
                Order Management
            </Typography>
            <OrderListTable />
        </Box>
    )
}

export default OrdersPage
