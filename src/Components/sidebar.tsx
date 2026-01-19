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
  Image as MediaIcon,
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
  { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
  { label: "Services", path: "/services", icon: <ServicesIcon /> },
  { label: "Media Gallery", path: "/media", icon: <MediaIcon /> },
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Solar Cleaning
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Expert Admin
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <ListItem disablePadding key={item.path}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path)
                  if (isMobile) onClose()
                }}
                sx={{
                  backgroundColor: isActive ? "action.selected" : "transparent",
                  borderLeft: isActive ? "4px solid" : "4px solid transparent",
                  borderLeftColor: isActive ? "primary.main" : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "primary.main" : "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
          {authStore.user?.name}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mb: 2, color: "textSecondary" }}>
          {authStore.user?.role}
        </Typography>
        <Button fullWidth variant="outlined" startIcon={<LogoutIcon />} size="small" onClick={handleLogout}>
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
          backgroundColor: "#fafafa",
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
