import { Box, IconButton, useTheme, Menu, MenuItem, Typography, Badge } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import moment from 'moment';

const Topbar = ({ setSidebarCollapsed }) => { // Removed the unused setIsSidebar prop
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, clearUnread } = useNotification();

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    clearUnread();
  };
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setSettingsAnchorEl(null);
  };
  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  const handleStoreManagement = () => {
    handleMenuClose();
    navigate("/stores");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={() => setSidebarCollapsed((prev) => !prev)}>
          <MenuOutlinedIcon />
        </IconButton>
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" ml={1}>
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>

        <IconButton onClick={handleNotificationsClick}>
          <Badge badgeContent={unreadCount} color="secondary">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        
        <IconButton onClick={handleSettingsClick}>
          <SettingsOutlinedIcon />
        </IconButton>
        
        <IconButton onClick={() => navigate("/profile")}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* NOTIFICATIONS MENU */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        MenuListProps={{ 'aria-labelledby': 'notifications-button' }}
        sx={{ maxHeight: 400 }}
      >
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={handleNotificationsClose} sx={{ borderBottom: `1px solid ${colors.grey[700]}`}}>
              <Box>
                <Typography variant="body1" fontWeight="bold" color={colors.greenAccent[400]}>
                  {notif.priority}: {notif.storeName}
                </Typography>
                <Typography variant="body2">{notif.message}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {moment(notif.timestamp).fromNow()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleNotificationsClose}>
            <Typography>No new notifications</Typography>
          </MenuItem>
        )}
      </Menu>

      {/* SETTINGS MENU */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'settings-button' }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        {user?.role === 'owner' && (
          <MenuItem onClick={handleStoreManagement}>Store Management</MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;