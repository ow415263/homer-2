import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const AuthGate = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Checking your account...
          </Typography>
        </Box>
      </Box>
    );
  }

  return children;
};

export default AuthGate;
