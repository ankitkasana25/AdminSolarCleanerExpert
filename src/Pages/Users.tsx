import { Typography, Box, Button } from "@mui/material"
import UserListTable from "@/Components/user-list-table"
import { Add as AddIcon } from "@mui/icons-material"
import { Link } from "react-router-dom"

const UsersPage = () => {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    User Management
                </Typography>

                <Link to="/users/new">
                    <Button variant="contained" startIcon={<AddIcon />}>
                        Add User
                    </Button>
                </Link>
            </Box>
            <UserListTable />
        </Box>
    )
}

export default UsersPage
