import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // 'user' or 'owner'
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    // Make the function async
    e.preventDefault();
    setError("");
    // The login function is now async and returns a boolean
    const isLoggedIn = await login(email, password, userType);
    if (!isLoggedIn) {
      setError(
        "Invalid email or password for the selected user type. Please try again."
      );
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
          <Typography
            variant="h2"
            fontWeight="bold"
            color={colors.grey[100]}
            textAlign="center"
          >
            Welcome
          </Typography>
          <Typography
            variant="h5"
            color={colors.greenAccent[400]}
            textAlign="center"
            mb="30px"
          >
            Sign in to continue
          </Typography>

          <Box display="flex" flexDirection="column" gap="20px">
            {/* User Type Selection */}
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: colors.grey[100], mb: 1 }}
              >
                Login as:
              </FormLabel>
              <RadioGroup
                row
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                sx={{ justifyContent: "center" }}
              >
                <FormControlLabel
                  value="user"
                  control={
                    <Radio
                      sx={{
                        color: colors.greenAccent[400],
                        "&.Mui-checked": { color: colors.greenAccent[400] },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: colors.grey[100] }}>
                      User
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="owner"
                  control={
                    <Radio
                      sx={{
                        color: colors.greenAccent[400],
                        "&.Mui-checked": { color: colors.greenAccent[400] },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: colors.grey[100] }}>
                      Owner
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>

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
              Log In as {userType === "owner" ? "Owner" : "User"}
            </Button>
            <Typography
              variant="body2"
              textAlign="center"
              color={colors.grey[300]}
            >
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: colors.greenAccent[400] }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
