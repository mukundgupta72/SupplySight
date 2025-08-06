// src/scenes/storeDetail/index.js
import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, useTheme, Paper, TextField, Modal, IconButton } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { tokens } from "../../theme";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";

// const API_BASE_URL = 'https://supplysight-poi2.onrender.com';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const modalStyle = {
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

const StoreDetail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const { addToCart, updateInventory } = useStore();
  const { user } = useAuth();

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ open: false, type: null });
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [newItem, setNewItem] = useState({ sku: '', name: '', price: '', quantity: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/stores/${id}`);
      setStore(res.data);
    } catch (err) {
      console.error("Error fetching store data:", err);
      setStore(null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  if (loading) return <Typography m="20px">Loading...</Typography>;
  if (user.role === 'owner' && store && store.owner._id !== user.id) return <Navigate to="/" replace />;
  if (!store) return <Typography m="20px">Store not found!</Typography>;

  const handleOpenModal = (type, item = null) => {
    setSelectedItem(item);
    setModal({ open: true, type });
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setModal({ open: false, type: null });
    setSelectedItem(null);
    setNewItem({ sku: '', name: '', price: '', quantity: '' });
  };

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= selectedItem.cur) {
      addToCart(selectedItem, quantity, store);
      handleCloseModal();
    }
  };

  const handleInventoryChange = async (sku, change) => {
    const currentInventory = store.inventory;
    const newInventory = { ...currentInventory };
    if (!newInventory[sku]) {
      newInventory[sku] = { cur: 0, min: 0, max: 100, rop: 10 };
    }
    newInventory[sku].cur += change;
    if (newInventory[sku].cur < 0) newInventory[sku].cur = 0;

    const success = await updateInventory(store._id, newInventory);
    if (success) {
      fetchData();
      handleCloseModal();
    }
  };

  const handleRemoveItem = async (skuToRemove) => {
    if (window.confirm("Are you sure you want to remove this item from the store?")) {
      const currentInventory = store.inventory;
      const newInventory = { ...currentInventory };
      delete newInventory[skuToRemove];

      const success = await updateInventory(store._id, newInventory);
      if (success) {
        fetchData();
      }
    }
  };

  const handleAddNewItem = async () => {
    if (newItem.sku && newItem.quantity > 0) {
      const sku = newItem.sku.toUpperCase();
      await handleInventoryChange(sku, Number(newItem.quantity));
    }
  };

  const inventoryList = store.inventory
    ? Object.entries(store.inventory).map(([sku, data]) => ({ sku, ...data }))
    : [];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={store.name.toUpperCase()} subtitle={`Manage items for ${store.location}`} />
        {user.role === 'owner' && (
          <Button color="secondary" variant="contained" onClick={() => handleOpenModal('addItem')}>
            Add Item to Inventory
          </Button>
        )}
      </Box>

      <Box>
        {inventoryList.map((item) => (
          <Paper
            key={item.sku}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: "15px",
              mb: "10px",
              backgroundColor: colors.primary[400],
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">{item.sku}</Typography>
              <Typography>Name: {item.name || 'N/A'}</Typography>
            </Box>
            <Box textAlign="center">
              <Typography>Available Quantity</Typography>
              <Typography variant="h4" fontWeight="bold">{item.cur}</Typography>
            </Box>
            {user.role === 'user' ? (
              <Button color="secondary" variant="contained" onClick={() => handleOpenModal('buy', item)} disabled={item.cur === 0}>
                {item.cur === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            ) : (
              <Box>
                <Button color="secondary" variant="contained" onClick={() => handleOpenModal('addStock', item)} sx={{ mr: 1 }}>
                  Add Stock
                </Button>
                <Button color="error" variant="contained" onClick={() => handleOpenModal('reduceStock', item)}>
                  Reduce Stock
                </Button>
                <IconButton onClick={() => handleRemoveItem(item.sku)} color="error" sx={{ ml: 1 }}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </Paper>
        ))}
      </Box>

      {/* MODALS */}
      <Modal open={modal.open} onClose={handleCloseModal}>
        <Box sx={modalStyle} backgroundColor={colors.primary[500]}>
          {modal.type === 'addItem' && (
            <>
              <Typography variant="h4" mb={2}>Add Item to Inventory</Typography>
              <TextField fullWidth label="Item SKU (e.g., MILK001)" variant="filled" value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth type="number" label="Initial Quantity" variant="filled" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleAddNewItem} variant="contained" color="secondary" sx={{ ml: 1 }}>Add Item</Button>
              </Box>
            </>
          )}

          {modal.type === 'buy' && (
            <>
              <Typography variant="h4" mb={2}>{selectedItem?.name || selectedItem?.sku}</Typography>
              <TextField fullWidth type="number" label="Quantity" variant="filled" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} inputProps={{ min: 1, max: selectedItem?.cur }} />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleAddToCart} variant="contained" color="secondary" sx={{ ml: 1 }}>Add to Cart</Button>
              </Box>
            </>
          )}

          {(modal.type === 'addStock' || modal.type === 'reduceStock') && (
            <>
              <Typography variant="h4" mb={2}>
                {modal.type === 'addStock' ? 'Add Stock to' : 'Reduce Stock from'} {selectedItem?.name || selectedItem?.sku}
              </Typography>
              <TextField fullWidth type="number" label="Quantity" variant="filled" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} inputProps={{ min: 1, max: modal.type === 'reduceStock' ? selectedItem?.cur : undefined }} />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={() => handleInventoryChange(selectedItem.sku, modal.type === 'addStock' ? Number(quantity) : -Number(quantity))} variant="contained" color={modal.type === 'addStock' ? "secondary" : "error"} sx={{ ml: 1 }}>
                  {modal.type === 'addStock' ? 'Add to Stock' : 'Reduce Stock'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default StoreDetail;
