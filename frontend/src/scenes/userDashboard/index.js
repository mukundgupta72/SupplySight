// src/scenes/userDashboard/index.js
import { useEffect } from "react";
import { Box, Typography, Button, useTheme, Paper } from "@mui/material";
import { tokens } from "../../theme";
import { useStore } from "../../context/StoreContext";
import Header from "../../components/Header";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { stores, fetchStores } = useStore();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]); // FIX: Added dependency

  return (
    <Box m="20px">
      <Header title="STORES" subtitle="Browse available stores" />
      <Box
        display="grid"
        gap="20px"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      >
        {stores.map((store) => (
          <Paper
            key={store._id}
            elevation={2}
            sx={{
              backgroundColor: colors.primary[400],
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Box display="flex" alignItems="center" mb="15px">
              <StorefrontOutlinedIcon sx={{ color: colors.greenAccent[400], mr: "10px" }} />
              <Typography variant="h4" fontWeight="bold">
                {store.name}
              </Typography>
            </Box>
            <Typography variant="body1" mb="10px">
              {store.location}
            </Typography>
            <Typography variant="body2" color={colors.grey[300]} mb="20px">
              Sold by: {store.owner.name}
            </Typography>

            <Link to={`/store/${store._id}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="secondary">
                View Store
              </Button>
            </Link>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default UserDashboard;