// src/context/StoreContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);

// Backend URL
// const API_BASE_URL = 'https://supplysight-poi2.onrender.com';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [myStores, setMyStores] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/stores`);
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err.response ? err.response.data : err.message);
      setStores([]);
    }
    setLoading(false);
  };

  const fetchMyStores = async () => {
    if (!user || user.role !== 'owner') return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/stores/mystores`);
      setMyStores(res.data);
    } catch (err) {
      console.error("Error fetching my stores:", err.response ? err.response.data : err.message);
      setMyStores([]);
    }
    setLoading(false);
  };
  
  const addStore = async (storeData) => {
    try {
      await axios.post(`${API_BASE_URL}/api/stores`, storeData);
      fetchMyStores();
    } catch (err) {
      console.error("Error adding store:", err.response ? err.response.data : err.message);
    }
  };

  const removeStore = async (storeId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/stores/${storeId}`);
      fetchMyStores();
    } catch (err) {
      console.error("Error removing store:", err.response ? err.response.data : err.message);
    }
  };

  const updateInventory = async (storeId, newInventory) => {
    try {
      await axios.put(`${API_BASE_URL}/api/stores/${storeId}/inventory`, { inventory: newInventory });
      return true;
    } catch (err) {
      console.error("Error updating inventory:", err.response ? err.response.data : err.message);
      return false;
    }
  };
  
  const addToCart = (item, quantity, store) => {
    const itemToAdd = {
      sku: item.sku,
      name: item.name || item.sku,
      price: item.price || 0,
      quantity: quantity,
      storeId: store._id,
      storeName: store.name,
      ownerName: store.owner.name,
    };
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.sku === item.sku && cartItem.storeId === store._id);
      
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.sku === item.sku && cartItem.storeId === store._id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, itemToAdd];
      }
    });
  };

  const confirmOrder = async () => {
    if (cart.length === 0) {
      console.log("Cart is empty. Cannot confirm order.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/stores/order`, { cart });

      const newOrder = {
        id: new Date().getTime(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
        date: new Date().toLocaleDateString(),
      };
      
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setCart([]);

      if (user?.role === 'owner') {
        fetchMyStores();
      } else {
        fetchStores();
      }

    } catch (err) {
      console.error("Failed to confirm order:", err.response ? err.response.data : err.message);
      alert("There was an error placing your order. Please try again.");
    }
  };

  const cancelOrder = (orderId) => {
    const orderToCancel = orders.find(order => order.id === orderId);
    if (!orderToCancel) return;
    
    console.log("Cancelling order. NOTE: Stock is not returned to inventory in this version.");
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };
  
  const value = {
    stores,
    myStores,
    cart,
    orders,
    loading,
    fetchStores,
    fetchMyStores,
    addStore,
    removeStore,
    updateInventory,
    addToCart,
    confirmOrder,
    cancelOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  return useContext(StoreContext);
};
