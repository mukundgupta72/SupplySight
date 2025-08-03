import { useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { NotificationProvider } from "./context/NotificationContext";

// Notification Components
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationHandler from './components/NotificationHandler';

// Import Components and Scenes
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login";
import Signup from "./scenes/signup";
import UserDashboard from "./scenes/userDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StoreManagement from "./scenes/stores";
import StoreDetail from "./scenes/storeDetail";
import Cart from "./scenes/cart";
import Orders from "./scenes/orders";
import Profile from "./scenes/profile";

const MainLayout = () => {
  // State for the sidebar is managed here, in the parent component of Sidebar and Topbar.
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app">
      {/* Pass the state to the Sidebar component */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <main className="content">
        {/* Pass the state setter to the Topbar component */}
        <Topbar setSidebarCollapsed={setSidebarCollapsed} />
        <Outlet />
      </main>
    </div>
  );
};

// This component will render the correct layout based on authentication status
const AppContent = () => {
  const { user } = useAuth();
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme.palette.mode}
        />
        <NotificationHandler />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'owner' ? '/' : '/user-dashboard'} />} />

          {/* Protected Routes Layout */}
          <Route element={<MainLayout />}>
            {/* OWNER ROUTES */}
            <Route element={<ProtectedRoute requiredRole="owner" />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/stores" element={<StoreManagement />} />
            </Route>

            {/* USER ROUTES */}
            <Route element={<ProtectedRoute requiredRole="user" />}>
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
            </Route>
            
            {/* SHARED ROUTE (accessible by any logged-in user) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/store/:id" element={<StoreDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Main App component now just wraps the content with all necessary providers
function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
