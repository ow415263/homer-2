import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Snackbar, Alert, Badge, Tabs, Tab, CircularProgress } from '@mui/material';
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
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { addUserCard, subscribeToUserCards } from '../lib/cardsRepository';

const FALLBACK_CARD_IMAGE = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80';

const buildInitialCards = () => (
    [...sentPostcards.map(card => ({ ...card, type: 'sent' })),
    ...receivedPostcards.map(card => ({ ...card, type: 'received' }))]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
);

const Exchange = () => {
    const [viewMode, setViewMode] = useState('default'); // 'default', 'sender', 'receiver'
    const [tabValue, setTabValue] = useState(0); // 0: All, 1: Sent, 2: Received
    const [cards, setCards] = useState(() => buildInitialCards());
    const { setIsFullscreen } = useLayout();
    const { user } = useAuth();

    const [notification, setNotification] = useState({ open: false, message: '' });
    const [hasPendingWrite, setHasPendingWrite] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showNewCardIndicator, setShowNewCardIndicator] = useState(false);
    const [pendingCardId, setPendingCardId] = useState(null);
    const [cardsLoading, setCardsLoading] = useState(false);
    const [cardsError, setCardsError] = useState(null);
    const indicatorBarRef = useRef(null);

    // Reset fullscreen when unmounting or switching to default
    useEffect(() => {
        if (viewMode === 'default') {
            setIsFullscreen(false);
        } else {
            setIsFullscreen(true);
        }
        return () => setIsFullscreen(false);
    }, [viewMode, setIsFullscreen]);

    useEffect(() => {
        if (!user) {
            setCards(buildInitialCards());
            setCardsLoading(false);
            return;
        }

        setCardsLoading(true);
        setCardsError(null);
        const unsubscribe = subscribeToUserCards(
            user.uid,
            (remoteCards) => {
                setCards(remoteCards.length ? remoteCards : buildInitialCards());
                setCardsLoading(false);
            },
            (error) => {
                console.error('Failed to load cards', error);
                setCardsError(error.message || 'Unable to load cards');
                setCardsLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSenderComplete = async (data) => {
        const previewMedia = data.media || [];
        const primaryMedia = previewMedia[0];
        const newCard = {
            title: data.title || 'New Memory',
            description: data.description,
            date: data.date,
            image: primaryMedia?.url || FALLBACK_CARD_IMAGE,
            type: 'sent',
            sender: 'You',
            media: previewMedia,
            location: data.location ? { name: data.location } : undefined
        };
        const tempId = `temp-${Date.now()}`;
        const cardForDisplay = { ...newCard, id: tempId };
        const { id: _, ...cardPayload } = cardForDisplay;

        setCards(prev => [cardForDisplay, ...prev]);
        setHasPendingWrite(false);
        setPendingCardId(tempId);
        setShowNewCardIndicator(true);
        setViewMode('default');

        if (!user) {
            setNotification({ open: true, message: 'Memory saved locally.' });
            return;
        }

        try {
            const docId = await addUserCard(user.uid, cardPayload);
            setCards(prev => prev.map(card => card.id === tempId ? { ...card, id: docId } : card));
            setPendingCardId(docId);
            setNotification({ open: true, message: 'Memory added to your history.' });
        } catch (error) {
            console.error('Failed to save card', error);
            setCards(prev => prev.filter(card => card.id !== tempId));
            setPendingCardId(null);
            setShowNewCardIndicator(false);
            setNotification({ open: true, message: 'Unable to save your memory. Please try again.' });
        }
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

    useEffect(() => {
        if (!showNewCardIndicator || !indicatorBarRef.current) return;

        const ctx = gsap.context(() => {
            gsap.set(indicatorBarRef.current, { width: '0%', opacity: 1 });
            gsap.to(indicatorBarRef.current, {
                width: '100%',
                duration: 1.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.to(indicatorBarRef.current, {
                        opacity: 0,
                        duration: 0.4,
                        delay: 0.2,
                        onComplete: () => {
                            setShowNewCardIndicator(false);
                            setPendingCardId(null);
                        }
                    });
                }
            });
        });

        return () => ctx.revert();
    }, [showNewCardIndicator, cards, pendingCardId]);

    // Filter cards based on tab
    const displayCards = tabValue === 0 ? cards :
        tabValue === 1 ? cards.filter(c => c.type === 'sent') :
            cards.filter(c => c.type === 'received');

    // API Key from prompt
    const GOOGLE_MAPS_API_KEY = 'AIzaSyCutvv7f2R1FV-ScEC_6gJfvMBCFAAYJdw';

    if (viewMode === 'sender') {
        return <SenderFlow onComplete={handleSenderComplete} onExit={handleSenderExit} />;
    }

    if (viewMode === 'receiver') {
        const cardData = selectedCard ? {
            title: selectedCard.title,
            description: selectedCard.description || (selectedCard.sender ? `From: ${selectedCard.sender}` : 'Your memory'),
            media: selectedCard.media?.length
                ? selectedCard.media
                : selectedCard.image
                    ? [{ url: selectedCard.image, type: 'image/jpeg' }]
                    : [],
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

    if (cardsLoading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
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

            {cardsError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {cardsError}
                </Alert>
            )}

            {/* Cards List */}
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {displayCards.map((item) => (
                        <React.Fragment key={item.id}>
                            <Paper
                                component={motion.div}
                                layoutId={`card-${item.id}`}
                                onClick={() => handleCardClick(item)}
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
                                {showNewCardIndicator && pendingCardId === item.id ? (
                                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Adding your latest card...
                                        </Typography>
                                        <Box sx={{
                                            height: 6,
                                            width: '100%',
                                            borderRadius: 999,
                                            bgcolor: 'grey.200',
                                            overflow: 'hidden'
                                        }}>
                                            <Box
                                                ref={indicatorBarRef}
                                                sx={{
                                                    height: '100%',
                                                    width: '0%',
                                                    bgcolor: 'primary.main'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </Paper>
                        </React.Fragment>
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
