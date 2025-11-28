import React from 'react';
import { Box, Typography, Avatar, Paper, Grid, Divider } from '@mui/material';
import { sentPostcards, receivedPostcards } from '../data/mockData';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
    const sentCount = sentPostcards.length;
    const receivedCount = receivedPostcards.length;

    return (
        <Box sx={{ p: 3, pb: 10 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
                    <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold">Traveler</Typography>
                <Typography variant="body2" color="text.secondary">traveler@homer.app</Typography>
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
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1" color="error">Log Out</Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Profile;
