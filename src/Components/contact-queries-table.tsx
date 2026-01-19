"use client"

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material"
import { Visibility as EyeIcon, Edit as EditIcon } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { contactStore } from "@/Store/contact-store"
import { useState } from "react"
import type { ContactQuery } from "@/Store/contact-store"

const ContactQueriesTable = observer(() => {
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [newStatus, setNewStatus] = useState<ContactQuery["status"]>("new")

  const handleOpenDialog = (query: ContactQuery) => {
    setSelectedQuery(query)
    setNewStatus(query.status)
    setOpenDialog(true)
  }

  const handleStatusUpdate = async () => {
    if (selectedQuery) {
      await contactStore.updateQueryStatus(selectedQuery.id, newStatus)
      setOpenDialog(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "success"
      case "in-progress":
        return "info"
      case "new":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assigned To</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contactStore.queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell>{query.userName}</TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {query.message}
                </TableCell>
                <TableCell>
                  <Chip label={query.status} color={getStatusColor(query.status)} size="small" />
                </TableCell>
                <TableCell>{query.assignedTo || "-"}</TableCell>
                <TableCell>{new Date(query.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={() => handleOpenDialog(query)} title="View">
                      <EyeIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDialog(query)} title="Update">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        {selectedQuery && (
          <>
            <DialogTitle>Query Details</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>User:</strong> {selectedQuery.userName}
                </Typography>
                <Typography variant="body2">
                  <strong>Message:</strong> {selectedQuery.message}
                </Typography>
                {selectedQuery.attachments.length > 0 && (
                  <Typography variant="body2">
                    <strong>Attachments:</strong> {selectedQuery.attachments.length} file(s)
                  </Typography>
                )}
              </Box>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ContactQuery["status"])}
                  label="Status"
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleStatusUpdate} disabled={contactStore.isLoading}>
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
})

export default ContactQueriesTable
