// src/scenes/signup/index.js
import { useState } from 'react';
import { Box, Button, TextField, Typography, useTheme, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Link } from "react-router-dom"; // Removed useNavigate
import { useAuth } from '../../context/AuthContext';
import { tokens } from "../../theme";

const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const { register } = useAuth();
  // const navigate = useNavigate(); // This was unused because navigation is handled in AuthContext

  // ... (rest of the file is the same)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const isRegistered = await register(name, email, password, userType);
    if (!isRegistered) {
      setError('Could not register user. The email might already be in use.');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      backgroundColor={colors.primary[400]}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: colors.primary[500],
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h2" fontWeight="bold" color={colors.grey[100]} textAlign="center">
            Create Account
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]} textAlign="center" mb="30px">
            Sign up to get started
          </Typography>

          <Box display="flex" flexDirection="column" gap="20px">
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              variant="filled"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              variant="filled"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ color: colors.grey[100], mb: 1 }}>
                Register as:
              </FormLabel>
              <RadioGroup
                row
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                sx={{ justifyContent: 'center' }}
              >
                <FormControlLabel
                  value="user"
                  control={<Radio sx={{ color: colors.greenAccent[400], '&.Mui-checked': { color: colors.greenAccent[400] } }} />}
                  label={<Typography sx={{ color: colors.grey[100] }}>User</Typography>}
                />
                <FormControlLabel
                  value="owner"
                  control={<Radio sx={{ color: colors.greenAccent[400], '&.Mui-checked': { color: colors.greenAccent[400] } }} />}
                  label={<Typography sx={{ color: colors.grey[100] }}>Owner</Typography>}
                />
              </RadioGroup>
            </FormControl>

            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              color="secondary"
              variant="contained"
              sx={{ padding: "10px", fontSize: "16px", fontWeight: "bold" }}
            >
              Sign Up as {userType === 'owner' ? 'Owner' : 'User'}
            </Button>
            <Typography variant="body2" textAlign="center" color={colors.grey[300]}>
                Already have an account? <Link to="/login" style={{ color: colors.greenAccent[400] }}>Log In</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;