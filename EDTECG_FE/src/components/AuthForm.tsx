import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import authService, { LoginRequest, RegisterRequest } from '../services/authService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`,
  };
}

const AuthForm: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    username: '',
    password: ''
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Form validation errors
  const [loginErrors, setLoginErrors] = useState<Partial<LoginRequest>>({});
  const [registerErrors, setRegisterErrors] = useState<Partial<RegisterRequest>>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setMessage(null);
    setLoginErrors({});
    setRegisterErrors({});
  };

  const validateLoginForm = (): boolean => {
    const errors: Partial<LoginRequest> = {};
    
    if (!loginForm.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!loginForm.password) {
      errors.password = 'Password is required';
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const errors: Partial<RegisterRequest> = {};
    
    if (!registerForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!registerForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (registerForm.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await authService.login(loginForm);
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      // Redirect to dashboard or home page after successful login
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await authService.register(registerForm);
      setMessage({ type: 'success', text: 'Registration successful! You can now login.' });
      // Switch to login tab after successful registration
      setTimeout(() => {
        setTabValue(0);
        setMessage(null);
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginForm(prev => ({ ...prev, [field]: e.target.value }));
    if (loginErrors[field]) {
      setLoginErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegisterChange = (field: keyof RegisterRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterForm(prev => ({ ...prev, [field]: e.target.value }));
    if (registerErrors[field]) {
      setRegisterErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            Welcome
          </Typography>

          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="auth tabs">
              <Tab label="Login" {...a11yProps(0)} />
              <Tab label="Register" {...a11yProps(1)} />
            </Tabs>
          </Box>

          {/* Login Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box component="form" onSubmit={handleLoginSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={loginForm.username}
                onChange={handleLoginChange('username')}
                error={!!loginErrors.username}
                helperText={loginErrors.username}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={handleLoginChange('password')}
                error={!!loginErrors.password}
                helperText={loginErrors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>
          </TabPanel>

          {/* Register Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box component="form" onSubmit={handleRegisterSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                autoFocus
                value={registerForm.fullName}
                onChange={handleRegisterChange('fullName')}
                error={!!registerErrors.fullName}
                helperText={registerErrors.fullName}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={registerForm.username}
                onChange={handleRegisterChange('username')}
                error={!!registerErrors.username}
                helperText={registerErrors.username}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={registerForm.password}
                onChange={handleRegisterChange('password')}
                error={!!registerErrors.password}
                helperText={registerErrors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange('confirmPassword')}
                error={!!registerErrors.confirmPassword}
                helperText={registerErrors.confirmPassword}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthForm; 