// src/scenes/profile/index.js
import { useState } from 'react';
import { Box, Button, Typography, useTheme, Avatar } from "@mui/material";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { tokens } from "../../theme";
import Header from "../../components/Header";

// const API_BASE_URL = 'https://supplysight-poi2.onrender.com';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { filePath } = res.data;
      const updateRes = await axios.put(`${API_BASE_URL}/api/auth/profilepic`, { profilePicPath: filePath });
      const { token } = updateRes.data;
      localStorage.setItem('token', token);
      window.location.reload();
      setMessage('Profile picture updated successfully!');

    } catch (err) {
      setMessage('File upload failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <Box m="20px">
      <Header title="PROFILE" subtitle="Manage your profile picture" />

      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          alt={user?.name}
          src={user?.profilePic ? `${API_BASE_URL}${user.profilePic}` : `../../assets/user.png`}
          sx={{ width: 150, height: 150, mb: 3 }}
        />
        <Typography variant="h3">{user?.name}</Typography>
        <Typography variant="h5" color={colors.greenAccent[400]}>{user?.email}</Typography>

        <Box component="form" onSubmit={onSubmit} mt={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Button
            variant="contained"
            component="label"
            color="secondary"
          >
            Choose File
            <input
              type="file"
              hidden
              onChange={onFileChange}
            />
          </Button>
          {file && <Typography>{file.name}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!file}
          >
            Upload Picture
          </Button>
          {message && <Typography color={message.includes('successfully') ? 'secondary' : 'error'} mt={2}>{message}</Typography>}
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
