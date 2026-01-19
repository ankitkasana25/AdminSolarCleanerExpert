import { useState } from "react"
import { Box, Button, TextField, Typography, Grid, MenuItem, Select, FormControl } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { authStore } from "@/Store/auth-store"
import { observer } from "mobx-react-lite"

const Login = observer(() => {
    const [email, setEmail] = useState("admin@example.com")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("admin")
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Simulation
            authStore.user = {
                id: "1",
                name: "Admin User",
                email: email,
                role: role as any,
                createdAt: new Date().toISOString()
            }
            authStore.isAuthenticated = true
            navigate("/dashboard")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
            {/* Left Side - Branding */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    background: "linear-gradient(135deg, #0d81fc 0%, #065caf 100%)", // Theme color gradient
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    position: "relative"
                }}
            >
                {/* Decorative circle */}
                <Box sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '50%',
                    height: '50%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }} />

                <Typography variant="h2" sx={{
                    fontSize: "32px", // Increased for better impact on colored bg
                    fontWeight: 800,
                    mb: 2,
                    letterSpacing: -0.5,
                    color: "#ffffff",
                    fontFamily: "'Outfit', sans-serif",
                    zIndex: 1,
                    textShadow: "0 4px 10px rgba(0,0,0,0.2)"
                }}>
                    Solar Cleaner Expert
                </Typography>
                <Typography variant="h5" sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 500,
                    zIndex: 1,
                    letterSpacing: 0.5
                }}>
                    Admin Panel
                </Typography>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "background.paper",
                    p: 4,
                    boxShadow: "-10px 0 30px rgba(0,0,0,0.05)",
                    zIndex: 2
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 450 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1a1a1a", fontFamily: "'Outfit', sans-serif" }}>
                        Sign In
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 5, color: "text.secondary", fontWeight: 500 }}>
                        Enter your credentials to access the admin panel
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "#1a1a1a" }}>
                                Email
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter your email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        bgcolor: "#f8f9fa",
                                        "& fieldset": { borderColor: "#e0e0e0" },
                                        "&:hover fieldset": { borderColor: "#bdbdbd" },
                                        "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 }
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "#1a1a1a" }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter your password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        bgcolor: "#f8f9fa",
                                        "& fieldset": { borderColor: "#e0e0e0" },
                                        "&:hover fieldset": { borderColor: "#bdbdbd" },
                                        "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 }
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: "#1a1a1a" }}>
                                Role
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    displayEmpty
                                    sx={{
                                        borderRadius: "12px",
                                        bgcolor: "#f8f9fa",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bdbdbd" },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main", borderWidth: 2 }
                                    }}
                                >
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="support">Support</MenuItem>
                                    <MenuItem value="viewer">Viewer</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                py: 1.8,
                                borderRadius: "12px",
                                fontWeight: 700,
                                textTransform: "none",
                                fontSize: "1.1rem",
                                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                                background: "linear-gradient(45deg, #0d81fc 30%, #4facfe 90%)",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    boxShadow: "0 6px 20px rgba(0,118,255,0.23)",
                                    transform: "translateY(-1px)"
                                }
                            }}
                        >
                            Sign In
                        </Button>
                    </form>
                </Box>
            </Grid>
        </Grid>
    )
})

export default Login
