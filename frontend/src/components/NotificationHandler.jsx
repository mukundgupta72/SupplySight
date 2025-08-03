// src/components/NotificationHandler.jsx
import { useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const NotificationHandler = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (user?.role !== 'owner') {
      return;
    }

    const socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Join the owner's room for targeted notifications
      socket.emit('join_owner_room', { ownerId: user.id });
      console.log(`Joined owner room: owner_${user.id}`);
    });

    socket.on('restock_notification', (data) => {
      // Only process notifications for this owner's stores
      if (data.ownerId === user.id) {
        const message = `Restock ${data.sku} at ${data.storeName}. Stock: ${data.currentStock}`;
        
        // Add notification to our global state
        addNotification({ ...data, message, id: new Date().getTime() });
        
        // Show a toast
        switch (data.priority) {
          case 'CRITICAL':
            toast.error(`🔴 CRITICAL: ${message}`);
            break;
          case 'HIGH':
            toast.warn(`🟠 HIGH: ${message}`);
            break;
          default:
            toast.info(`🔵 MEDIUM: ${message}`);
            break;
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, addNotification]);

  return null;
};

export default NotificationHandler;