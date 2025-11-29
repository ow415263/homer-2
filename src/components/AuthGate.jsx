import React, { useState } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useAuth } from '../context/AuthContext';

const AuthGate = ({ children }) => {
  const { user, loading, signIn } = useAuth();
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(err?.message || 'Unable to sign in. Please try again.');
    }
  };

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

  if (!user) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 420, width: '100%', textAlign: 'center', borderRadius: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <TravelExploreIcon color="primary" sx={{ fontSize: 56 }} />
            <Typography variant="h5" fontWeight="bold">
              Sign in to continue
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect your Google account so we can save your postcards and sync them across devices.
            </Typography>
            <Button variant="contained" size="large" onClick={handleSignIn} sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}>
              Sign in with Google
            </Button>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  return children;
};

export default AuthGate;
