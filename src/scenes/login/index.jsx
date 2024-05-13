import React, { useState } from 'react';
import {
  useTheme,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
  ThemeProvider
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";



const Login = ({ onLogin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [credentials] = useState({ email: '', password: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true); 
    
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    
      const data = await response.json();  // Parse the response body once
    
      if (!response.ok) {
        setError(data.message || 'Failed to log in');
        return; // Stop further execution
      }
    
      console.log('Login successful for:', data);
      onLogin(data); // Pass any needed user data
      navigate('/dashboard', { replace: true });
      setError('');
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error during login:', error);
    }}
    


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary[400],
            padding: 3,
            borderRadius: 8,
            mt: 8,
            mr: "auto",
          }}
        >
          <img
            src={require("../../data/stegia-logo.png")}
            alt="logo"
            style={{ width: 250, height: 230 }}
          />
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={formSubmitted && !credentials.email && credentials.email !== ''}
              helperText={
                (formSubmitted && !credentials.email && credentials.email !== '') ? "Invalid email or password" : ""
              }
              sx={
                theme.palette.mode === "dark"
                  ? { color: "white" }
                  : { color: "black" }
              }
            />
            <TextField
              color="primary"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={formSubmitted && !credentials.password && credentials.password !== ''}
              helperText={
                (formSubmitted && !credentials.password  && credentials.password !== '') ? "Invalid email or password" : ""
              }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Login
            </Button>
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <Grid container>
              <Grid item xs>
                <Link href="/forgotPassword" variant="body2" sx={{ color: theme.palette.mode === "dark" ? "white" : "black" }}>
                  {"Forgot password?"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2" sx={{ color: theme.palette.mode === "dark" ? "white" : "black" }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
