// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Set backend URL
const API_BASE_URL = 'https://supplysight-poi2.onrender.com';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setAuthToken(token);
          setUser(decoded.user);
        }
      } catch (error) {
        logout();
      }
    }
  }, [logout]);

  const login = async (email, password, userType) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ email, password, role: userType });
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, body, config);
      const { token } = res.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      const decoded = jwtDecode(token);
      setUser(decoded.user);
      if (decoded.user.role === 'owner') {
        navigate('/');
      } else {
        navigate('/user-dashboard');
      }
      return true;
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ name, email, password, role });
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, body, config);
      const { token } = res.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      const decoded = jwtDecode(token);
      setUser(decoded.user);
      if (decoded.user.role === 'owner') {
        navigate('/');
      } else {
        navigate('/user-dashboard');
      }
      return true;
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      return false;
    }
  };

  const value = { user, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
