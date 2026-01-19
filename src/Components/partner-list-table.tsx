"use client"

import { useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Box,
    Typography,
    Avatar,
    Rating,
} from "@mui/material"
import { Delete as DeleteIcon } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { userStore } from "@/Store/user-store"

const PartnerListTable = observer(() => {
    useEffect(() => {
        userStore.fetchUsers() // In real app, might fetch with role='partner' filter
    }, [])

    // Filter for partners only
    const partners = userStore.users.filter((user) => user.role === "partner")

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this partner?")) {
            await userStore.deleteUser(id)
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Partner</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Contact Info</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Service Area</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Joined</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {partners.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">No partners found.</TableCell>
                        </TableRow>
                    ) : (
                        partners.map((partner) => (
                            <TableRow key={partner.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar>{partner.name.charAt(0)}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle2">{partner.name}</Typography>
                                            {/* Mock Rating */}
                                            <Rating value={4.5} precision={0.5} size="small" readOnly />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{partner.email}</Typography>
                                    <Typography variant="caption" color="textSecondary">{partner.phone}</Typography>
                                </TableCell>
                                <TableCell>{partner.address || "All Areas"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={partner.status}
                                        color={partner.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(partner.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleDelete(partner.id)} color="error">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
})

export default PartnerListTable
