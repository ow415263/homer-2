import React, { useMemo, useState } from 'react';
import { Box, Typography, Avatar, Paper, Grid, Divider, Button, CircularProgress } from '@mui/material';
import { sentPostcards, receivedPostcards } from '../data/mockData';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const sentCount = sentPostcards.length;
    const receivedCount = receivedPostcards.length;
    const { user, loading, signIn, signOut } = useAuth();
    const [authError, setAuthError] = useState(null);

    const userDetails = useMemo(() => ({
        name: user?.displayName || 'Traveler',
        email: user?.email || 'Sign in to sync your memories',
        photoURL: user?.photoURL || null
    }), [user]);

    const handleSignIn = async () => {
        setAuthError(null);
        try {
            await signIn();
        } catch (error) {
            setAuthError(error.message || 'Unable to sign in. Please try again.');
        }
    };

    const handleSignOut = async () => {
        setAuthError(null);
        try {
            await signOut();
        } catch (error) {
            setAuthError(error.message || 'Unable to sign out. Please try again.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, pb: 10 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }} src={userDetails.photoURL}>
                    {!userDetails.photoURL && <PersonIcon sx={{ fontSize: 60 }} />}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">{userDetails.name}</Typography>
                <Typography variant="body2" color="text.secondary">{userDetails.email}</Typography>
                <Button
                    variant={user ? 'outlined' : 'contained'}
                    onClick={user ? handleSignOut : handleSignIn}
                    sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    {user ? 'Sign out' : 'Sign in with Google'}
                </Button>
                {authError && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {authError}
                    </Typography>
                )}
            </Box>

            <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Your Journey</Typography>
                <Grid container spacing={2} textAlign="center">
                    <Grid item xs={6}>
                        <Typography variant="h3" color="primary.main" fontWeight="bold">
                            {sentCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cards Sent
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h3" color="secondary.main" fontWeight="bold">
                            {receivedCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cards Received
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Account Settings</Typography>
                <Paper elevation={0} variant="outlined" sx={{ borderRadius: 4 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1">Edit Profile</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1">Notifications</Typography>
                    </Box>
                    <Divider />
                    {user && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body1" color="error" onClick={handleSignOut} sx={{ cursor: 'pointer' }}>
                                Log Out
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default Profile;
