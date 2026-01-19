import { Card, CardContent, Box, Typography } from "@mui/material"
import type React from "react"

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: string
  trend?: number
}

export const KPICard = ({ title, value, icon, color = "#1976d2", trend }: KPICardProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Box
            sx={{
              color: color,
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          {value}
        </Typography>
        {trend !== undefined && (
          <Typography variant="body2" sx={{ color: trend >= 0 ? "success.main" : "error.main" }}>
            {trend >= 0 ? "+" : ""}
            {trend}% from last month
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
