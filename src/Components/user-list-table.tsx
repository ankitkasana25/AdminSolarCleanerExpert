"use client"

import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from "@mui/material"
import { Edit as EditIcon, Visibility as EyeIcon } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"
import { userStore } from "@/Store/user-store"

const UserListTable = observer(() => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    userStore.setFilters({ page: newPage + 1 })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    userStore.setFilters({ limit: Number.parseInt(event.target.value, 10), page: 1 })
  }

  const handleSearchChange = (value: string) => {
    userStore.setFilters({ search: value, page: 1 })
  }

  const handleStatusChange = (value: string) => {
    userStore.setFilters({ status: value as any, page: 1 })
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "error"
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by name or email..."
          value={userStore.filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={userStore.filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            label="Status"
            size="small"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userStore.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip label={user.status} color={getStatusColor(user.status)} size="small" />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    <IconButton size="small" title="View">
                      <EyeIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  <Link to={`/users/${user.id}/edit`}>
                    <IconButton size="small" title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={userStore.total}
          rowsPerPage={userStore.filters.limit}
          page={userStore.filters.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  )
})

export default UserListTable
