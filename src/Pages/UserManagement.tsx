import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, Button } from "@mui/material"
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import UserForm from "@/Components/user-form"

const UserManagementPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/users")}>
                    Back
                </Button>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {id ? "Edit User" : "Add New User"}
                </Typography>
            </Box>
            <UserForm userId={id} onSuccess={() => navigate("/users")} />
        </Box>
    )
}

export default UserManagementPage
