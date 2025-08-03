// src/context/NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (notification) => {
    // Add the new notification to the top of the list
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const clearUnread = () => {
    setUnreadCount(0);
  };
  
  const value = {
    notifications,
    unreadCount,
    addNotification,
    clearUnread,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};