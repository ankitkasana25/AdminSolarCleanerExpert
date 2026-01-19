"use client"

import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material"
import { Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material"
import { observer } from "mobx-react-lite"
import { mediaStore } from "@/Store/media-store"
import { useState } from "react"

const MediaGallery = observer(() => {
  const [selectedMedia, setSelectedMedia] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [statusNotes, setStatusNotes] = useState("")

  const handleOpenDialog = (media: any) => {
    setSelectedMedia(media)
    setStatusNotes(media.notes || "")
    setOpenDialog(true)
  }

  const handleApprove = async () => {
    if (selectedMedia) {
      await mediaStore.updateMediaStatus(selectedMedia.id, "approved", statusNotes)
      setOpenDialog(false)
    }
  }

  const handleReject = async () => {
    if (selectedMedia) {
      await mediaStore.updateMediaStatus(selectedMedia.id, "rejected", statusNotes)
      setOpenDialog(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      await mediaStore.deleteMedia(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "error"
      default:
        return "warning"
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        {mediaStore.media.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia component="img" height="200" image={item.thumbnailUrl} alt={item.fileName} />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                  {item.fileName}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                  Uploaded by: {item.uploadedBy}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 2 }}>
                  {new Date(item.uploadedAt).toLocaleDateString()}
                </Typography>
                <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleOpenDialog(item)}>
                  Review
                </Button>
                <IconButton size="small" onClick={() => handleDelete(item.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        {selectedMedia && (
          <>
            <DialogTitle>Review Media</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <CardMedia component="img" image={selectedMedia.url} alt={selectedMedia.fileName} />
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>File:</strong> {selectedMedia.fileName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Uploaded by:</strong> {selectedMedia.uploadedBy}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Status:</strong>{" "}
                <Chip label={selectedMedia.status} color={getStatusColor(selectedMedia.status)} size="small" />
              </Typography>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Add approval/rejection notes..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={handleReject}
                disabled={mediaStore.isLoading}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={handleApprove}
                disabled={mediaStore.isLoading}
              >
                Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
})

export default MediaGallery
