import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import authService from '../services/authService';

const AuthTest: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
  }>({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null
  });

  const updateAuthStatus = () => {
    setAuthStatus({
      isAuthenticated: authService.isAuthenticated(),
      accessToken: authService.getAccessToken(),
      refreshToken: authService.getRefreshToken()
    });
  };

  useEffect(() => {
    updateAuthStatus();
  }, []);

  const handleLogout = () => {
    authService.logout();
    updateAuthStatus();
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    updateAuthStatus();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Authentication Test
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Authentication Status
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Is Authenticated" 
                secondary={authStatus.isAuthenticated ? 'Yes' : 'No'} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Access Token" 
                secondary={authStatus.accessToken ? 'Present' : 'Not present'} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Refresh Token" 
                secondary={authStatus.refreshToken ? 'Present' : 'Not present'} 
              />
            </ListItem>
          </List>

          {authStatus.accessToken && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Access Token: {authStatus.accessToken.substring(0, 20)}...
              </Typography>
            </Alert>
          )}

          {authStatus.refreshToken && (
            <Alert severity="info" sx={{ mt: 1 }}>
              <Typography variant="body2">
                Refresh Token: {authStatus.refreshToken.substring(0, 20)}...
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </Button>
        
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={handleLogout}
          disabled={!authStatus.isAuthenticated}
        >
          Logout
        </Button>
        
        <Button 
          variant="outlined" 
          color="error"
          onClick={clearTokens}
        >
          Clear Tokens
        </Button>
        
        <Button 
          variant="outlined"
          onClick={updateAuthStatus}
        >
          Refresh Status
        </Button>
      </Box>

      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          This is a test component to verify authentication functionality. 
          In production, you would remove this component.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AuthTest; 