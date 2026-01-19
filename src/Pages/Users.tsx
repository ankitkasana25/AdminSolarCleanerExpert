import { Typography, Box, Button } from "@mui/material"
import UserListTable from "@/Components/user-list-table"
import { Add as AddIcon } from "@mui/icons-material"

const UsersPage = () => {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    User Management
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Add User
                </Button>
            </Box>
            <UserListTable />
        </Box>
    )
}

export default UsersPage
