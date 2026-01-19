import { useState } from "react"
import { Box, Button, TextField, Typography, Paper, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { authStore } from "@/Store/auth-store"
import { observer } from "mobx-react-lite"

const Login = observer(() => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        // authStore.login is async and might hit real API. 
        // For now we simulate success if the API fails or just navigate
        try {
            // await authStore.login(email, password)
            // if (authStore.isAuthenticated) {
            //   navigate("/dashboard")
            // }

            // Simulation for preview:
            authStore.user = { id: "1", name: "Admin", email: email, role: "admin", createdAt: new Date().toISOString() }
            authStore.isAuthenticated = true
            navigate("/dashboard")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
                        Solar Cleaning
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Admin Panel Login
                    </Typography>
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    )
})

export default Login
