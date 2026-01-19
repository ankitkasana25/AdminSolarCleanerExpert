import { Typography, Box, Button } from "@mui/material"
import PartnerListTable from "@/Components/partner-list-table"
import { Add as AddIcon } from "@mui/icons-material"

const PartnersPage = () => {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        Partners
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Manage service partners and technicians.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Add Partner
                </Button>
            </Box>
            <PartnerListTable />
        </Box>
    )
}

export default PartnersPage
