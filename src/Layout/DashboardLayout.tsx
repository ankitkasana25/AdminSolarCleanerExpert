import type React from "react"
import { useState } from "react"
import { Box, Container } from "@mui/material"
import Sidebar, { DashboardTopBar } from "@/Components/sidebar"
import { observer } from "mobx-react-lite"

const DashboardLayout = observer(({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleDrawerToggle = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
            <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <DashboardTopBar onMenuClick={handleDrawerToggle} />
                <Container component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
                    {children}
                </Container>
            </Box>
        </Box>
    )
})

export default DashboardLayout
