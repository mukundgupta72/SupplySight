// src/scenes/stores/index.js
import { useState, useEffect } from "react";
import { Box, Typography, Button, useTheme, Modal, TextField, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useStore } from "../../context/StoreContext";
import { Link } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StoreManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { myStores, addStore, fetchMyStores, removeStore } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreLocation, setNewStoreLocation] = useState("");

  useEffect(() => {
    fetchMyStores();
  }, [fetchMyStores]); // FIX: Added dependency

  // ... (rest of the file is the same)
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAddStore = () => {
    if (newStoreName && newStoreLocation) {
      addStore({ name: newStoreName, location: newStoreLocation });
      setNewStoreName("");
      setNewStoreLocation("");
      handleCloseModal();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Store Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "access",
      headerName: "Access Store",
      flex: 1,
      renderCell: ({ row: { _id } }) => (
        <Link to={`/store/${_id}`} style={{ textDecoration: "none" }}>
          <Button color="secondary" variant="contained">
            View Store
          </Button>
        </Link>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row: { _id } }) => (
        <IconButton
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this store?")) {
              removeStore(_id);
            }
          }}
          color="error"
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="STORE MANAGEMENT" subtitle="List of Your Stores" />
        <Button color="secondary" variant="contained" onClick={handleOpenModal}>
          Add New Store
        </Button>
      </Box>

      <Box m="40px 0 0 0" height="75vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
        <DataGrid
          rows={myStores}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={style} backgroundColor={colors.primary[500]}>
          <Typography variant="h4" mb={2}>
            Create a New Store
          </Typography>
          <TextField
            fullWidth
            label="Store Name"
            variant="filled"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Store Location"
            variant="filled"
            value={newStoreLocation}
            onChange={(e) => setNewStoreLocation(e.target.value)}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={handleAddStore}
              variant="contained"
              color="secondary"
              sx={{ ml: 1 }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default StoreManagement;