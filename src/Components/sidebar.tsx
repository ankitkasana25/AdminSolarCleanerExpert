import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Build as ServicesIcon,
  Handshake as HandshakeIcon,
  Mail as ContactIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { authStore } from "@/Store/auth-store"

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  roles?: string[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Users", path: "/users", icon: <PeopleIcon /> },
  { label: "Partners", path: "/partners", icon: <HandshakeIcon /> },
  { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
  { label: "Services", path: "/services", icon: <ServicesIcon /> },
  { label: "Contact Queries", path: "/contact", icon: <ContactIcon /> },
]

const Sidebar = observer(({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleLogout = () => {
    authStore.logout()
    navigate("/login")
  }

  const sidebarContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#fff", borderRight: "1px solid rgba(0,0,0,0.05)" }}>
      <Box sx={{ p: 3, pt: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{
          fontWeight: 800,
          color: "#1a1a1a",
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: -0.5,
          mb: 0.5
        }}>
          Solar Cleaning
        </Typography>
        <Typography variant="caption" sx={{
          color: "text.secondary",
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 600,
          fontSize: "0.7rem",
          opacity: 0.8
        }}>
          Expert Admin
        </Typography>
      </Box>

      <Box sx={{ px: 2, mb: 1 }}>
        <Divider sx={{ opacity: 0.6 }} />
      </Box>


      <List sx={{ flex: 1, px: 2, pt: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <ListItem disablePadding key={item.path} sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path)
                  if (isMobile) onClose()
                }}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  px: 2,
                  backgroundColor: isActive ? "rgba(13, 129, 252, 0.08)" : "transparent",
                  color: isActive ? "#0d81fc" : "#64748b",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: isActive ? "rgba(13, 129, 252, 0.12)" : "rgba(0,0,0,0.03)",
                    transform: "translateX(3px)"
                  },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 40,
                  color: isActive ? "#0d81fc" : "#94a3b8",
                  transition: "color 0.2s"
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.95rem",
                    fontFamily: isActive ? "'Outfit', sans-serif" : "'Inter', sans-serif"
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Box sx={{
          p: 2,
          borderRadius: "16px",
          bgcolor: "#f8fafc",
          mb: 2,
          border: "1px solid #e2e8f0"
        }}>
          <Typography variant="subtitle2" display="block" sx={{ mb: 0.5, fontWeight: 700, color: "#334155" }}>
            {authStore.user?.name}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: "#64748b", fontWeight: 500 }}>
            {authStore.user?.role?.toUpperCase()}
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          size="small"
          onClick={handleLogout}
          sx={{
            borderRadius: "10px",
            borderColor: "#e2e8f0",
            color: "#64748b",
            "&:hover": {
              borderColor: "#cbd5e1",
              bgcolor: "#f1f5f9",
              color: "#0f172a"
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box >
  )

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            borderRight: "none",
            boxShadow: "10px 0 50px rgba(0,0,0,0.1)"
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRight: "none",
          boxShadow: "4px 0 24px rgba(0,0,0,0.02)"
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  )
})

export const DashboardTopBar = observer(({ onMenuClick }: { onMenuClick: () => void }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        height: 64,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6">{authStore.user?.name || "Dashboard"}</Typography>
      </Box>
    </Box>
  )
})

export default Sidebar
