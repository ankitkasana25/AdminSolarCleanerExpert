import { Typography, Box } from "@mui/material"
import ContactQueriesTable from "@/Components/contact-queries-table"

const ContactQueriesPage = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Contact Queries
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage incoming support requests and queries.
                </Typography>
            </Box>
            <ContactQueriesTable />
        </Box>
    )
}

export default ContactQueriesPage
