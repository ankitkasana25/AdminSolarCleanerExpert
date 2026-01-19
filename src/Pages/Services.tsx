import { Typography, Box, Button } from "@mui/material"
import ServiceListTable from "@/Components/service-list-table"
import { Add as AddIcon } from "@mui/icons-material"

const ServicesPage = () => {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Service Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Add Service
                </Button>
            </Box>
            <ServiceListTable />
        </Box>
    )
}

export default ServicesPage
