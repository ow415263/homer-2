import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, IconButton, Snackbar, Alert, Badge, Tabs, Tab } from '@mui/material';
import SenderFlow from '../components/SenderFlow';
import ReceiverFlow from '../components/ReceiverFlow';
import CreateIcon from '@mui/icons-material/Create';
import NfcIcon from '@mui/icons-material/Nfc';
import SendIcon from '@mui/icons-material/Send';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { useLayout } from '../context/LayoutContext';
import { motion } from 'framer-motion';
import { sentPostcards, receivedPostcards } from '../data/mockData';

const Exchange = () => {
    const [viewMode, setViewMode] = useState('default'); // 'default', 'sender', 'receiver'
    const [tabValue, setTabValue] = useState(0); // 0: All, 1: Sent, 2: Received
    const { setIsFullscreen } = useLayout();

    // Combine sent and received postcards with a type indicator
    const allCards = [
        ...sentPostcards.map(card => ({ ...card, type: 'sent' })),
        ...receivedPostcards.map(card => ({ ...card, type: 'received' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    const [notification, setNotification] = useState({ open: false, message: '' });
    const [hasPendingWrite, setHasPendingWrite] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Reset fullscreen when unmounting or switching to default
    useEffect(() => {
        if (viewMode === 'default') {
            setIsFullscreen(false);
        } else {
            setIsFullscreen(true);
        }
        return () => setIsFullscreen(false);
    }, [viewMode, setIsFullscreen]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSenderComplete = (data) => {
        // In a real app, this would add to the backend
        // For now, just clear the pending flag
        setHasPendingWrite(false);
        setViewMode('default');
    };

    const handleSenderExit = () => {
        setHasPendingWrite(true);
        setNotification({ open: true, message: "Memory hasn't been added to card properly" });
        setViewMode('default');
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setViewMode('receiver');
    };

    const handleReceiverExit = () => {
        setSelectedCard(null);
        setViewMode('default');
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Filter cards based on tab
    const displayCards = tabValue === 0 ? allCards :
        tabValue === 1 ? allCards.filter(c => c.type === 'sent') :
            allCards.filter(c => c.type === 'received');

    // API Key from prompt
    const GOOGLE_MAPS_API_KEY = 'AIzaSyCutvv7f2R1FV-ScEC_6gJfvMBCFAAYJdw';

    if (viewMode === 'sender') {
        return <SenderFlow onComplete={handleSenderComplete} onExit={handleSenderExit} />;
    }

    if (viewMode === 'receiver') {
        const cardData = selectedCard ? {
            title: selectedCard.title,
            description: selectedCard.sender ? `From: ${selectedCard.sender}` : 'Your memory',
            media: selectedCard.image ? [{ url: selectedCard.image, type: 'image/jpeg' }] : [],
            date: selectedCard.date,
            location: selectedCard.location
        } : {
            title: 'New Memory',
            description: 'Just received!',
            media: [],
            date: new Date().toLocaleDateString()
        };

        return (
            <ReceiverFlow
                apiKey={GOOGLE_MAPS_API_KEY}
                cardData={cardData}
                onExit={handleReceiverExit}
                layoutId={selectedCard ? `card-${selectedCard.id}` : undefined}
            />
        );
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Stats Section */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Grid container spacing={2} textAlign="center">
                    <Grid item xs={6}>
                        <Typography variant="h4" fontWeight="bold">{sentPostcards.length}</Typography>
                        <Typography variant="caption">Cards Sent</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h4" fontWeight="bold">{receivedPostcards.length}</Typography>
                        <Typography variant="caption">Cards Received</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Actions Section */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Badge
                    badgeContent={1}
                    color="error"
                    invisible={!hasPendingWrite}
                    sx={{ flex: 1, '& .MuiBadge-badge': { right: 10, top: 10 } }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<CreateIcon />}
                        onClick={() => setViewMode('sender')}
                        sx={{ py: 2, borderRadius: 3 }}
                    >
                        Write Message
                    </Button>
                </Badge>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<NfcIcon />}
                    onClick={() => setViewMode('receiver')}
                    sx={{ py: 2, borderRadius: 3, borderWidth: 2, flex: 1 }}
                >
                    Read Card
                </Button>
            </Box>

            {/* Tabs for Sent/Received/All */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="card tabs" variant="fullWidth">
                    <Tab icon={<AllInclusiveIcon />} iconPosition="start" label="All" />
                    <Tab icon={<SendIcon />} iconPosition="start" label="Sent" />
                    <Tab icon={<CallReceivedIcon />} iconPosition="start" label="Received" />
                </Tabs>
            </Box>

            {/* Cards List */}
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {displayCards.map((item) => (
                        <Paper
                            component={motion.div}
                            layoutId={`card-${item.id}`}
                            onClick={() => handleCardClick(item)}
                            key={item.id}
                            elevation={2}
                            sx={{
                                p: 0,
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
                            }}
                        >
                            <Box sx={{
                                width: '100%',
                                height: 200,
                                position: 'relative',
                                bgcolor: 'grey.200'
                            }}>
                                <img
                                    src={item.image}
                                    alt="Postcard"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                                {item.sender && (
                                    <Typography variant="body2" color="text.secondary">From: {item.sender}</Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ bottom: { xs: 90, sm: 24 } }}
            >
                <Alert onClose={handleCloseNotification} severity="error" sx={{ width: '100%', borderRadius: 2 }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Exchange;
