import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Snackbar,
    Alert,
    Badge,
    Tabs,
    Tab,
    CircularProgress,
    Stack,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextsmsIcon from '@mui/icons-material/Textsms';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SenderFlow from '../components/SenderFlow';
import ReceiverFlow from '../components/ReceiverFlow';
import CreateIcon from '@mui/icons-material/Create';
import NfcIcon from '@mui/icons-material/Nfc';
import SendIcon from '@mui/icons-material/Send';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { useLayout } from '../context/LayoutContext';
import { sentPostcards, receivedPostcards } from '../data/mockData';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { addUserCard, subscribeToUserCards } from '../lib/cardsRepository';
import { GOOGLE_MAPS_API_KEY } from '../lib/maps';

const FALLBACK_CARD_IMAGE = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80';

const buildInitialCards = () => (
    [...sentPostcards.map(card => ({ ...card, type: 'sent' })),
    ...receivedPostcards.map(card => ({ ...card, type: 'received' }))]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
);

const normalizeRemoteCard = (card) => {
    const parsedDate = (() => {
        if (!card.date && card.createdAt?.toDate) {
            return card.createdAt.toDate().toLocaleDateString();
        }
        if (!card.date) {
            return new Date().toLocaleDateString();
        }
        if (typeof card.date === 'string') {
            return card.date;
        }
        if (card.date?.toDate) {
            return card.date.toDate().toLocaleDateString();
        }
        return new Date(card.date).toLocaleDateString();
    })();

    return {
        ...card,
        type: card.type || 'sent',
        date: parsedDate,
        image: card.image || FALLBACK_CARD_IMAGE,
    };
};

const normalizeLocationForStorage = (location) => {
    if (!location) return undefined;
    if (typeof location === 'string') {
        return { name: location };
    }
    if (!location.name && location.formatted_address) {
        return { ...location, name: location.formatted_address };
    }
    return location;
};

const Exchange = () => {
    const [viewMode, setViewMode] = useState('default'); // 'default', 'sender', 'receiver'
    const [tabValue, setTabValue] = useState(0); // 0: All, 1: Sent, 2: Received
    const [cards, setCards] = useState(() => buildInitialCards());
    const { setIsFullscreen } = useLayout();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signIn, signInWithApple } = useAuth();
    const resumeAction = location.state?.resumeAction;

    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    const [hasPendingWrite, setHasPendingWrite] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showNewCardIndicator, setShowNewCardIndicator] = useState(false);
    const [pendingCardId, setPendingCardId] = useState(null);
    const [cardsLoading, setCardsLoading] = useState(false);
    const [cardsError, setCardsError] = useState(null);
    const indicatorBarRef = useRef(null);
    const [authPromptAction, setAuthPromptAction] = useState(null);
    const [authProcessing, setAuthProcessing] = useState(false);
    const [tapCardPromptOpen, setTapCardPromptOpen] = useState(false);

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
                const normalizedCards = remoteCards.map(normalizeRemoteCard);
                setCards(normalizedCards.length ? normalizedCards : buildInitialCards());
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
        const normalizedLocation = normalizeLocationForStorage(data.location);
        const newCard = {
            title: data.title || 'New Memory',
            description: data.description,
            date: data.date,
            image: primaryMedia?.url || FALLBACK_CARD_IMAGE,
            type: 'sent',
            sender: 'You',
            media: previewMedia,
            location: normalizedLocation
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
            setNotification({ open: true, message: 'Memory saved locally.', severity: 'info' });
            return;
        }

        try {
            const docId = await addUserCard(user.uid, {
                ...cardPayload,
                ownerId: user.uid,
            });
            setCards(prev => prev.map(card => card.id === tempId ? { ...card, id: docId } : card));
            setPendingCardId(docId);
            setNotification({ open: true, message: 'Memory embedded! Ready to be mailed.', severity: 'success' });
        } catch (error) {
            console.error('Failed to save card', error);
            setCards(prev => prev.filter(card => card.id !== tempId));
            setPendingCardId(null);
            setShowNewCardIndicator(false);
            setNotification({ open: true, message: 'Unable to save your memory. Please try again.', severity: 'error' });
        }
    };

    const handleSenderExit = () => {
        setHasPendingWrite(true);
        setNotification({ open: true, message: "Memory hasn't been added to card properly", severity: 'warning' });
        setViewMode('default');
    };

    const handleCardClick = (card) => {
        if (!user) {
            setSelectedCard(card);
            setAuthPromptAction('receiver');
            return;
        }
        setSelectedCard(card);
        setViewMode('receiver');
    };

    const handleReceiverExit = () => {
        setSelectedCard(null);
        setViewMode('default');
    };
    const requestAction = (action) => {
        if (user) {
            setViewMode(action);
            return;
        }
        setAuthPromptAction(action);
    };

    const handleTapCardChoice = (action) => {
        setTapCardPromptOpen(false);
        requestAction(action);
    };

    const closeTapCardPrompt = () => {
        setTapCardPromptOpen(false);
    };

    const closeAuthPrompt = () => {
        if (authProcessing) return;
        setAuthPromptAction(null);
        if (!user) {
            setSelectedCard(null);
        }
    };

    const finishAuthSuccess = () => {
        if (!authPromptAction) return;
        if (authPromptAction === 'sender') {
            setViewMode('sender');
        } else if (authPromptAction === 'receiver') {
            setViewMode('receiver');
        }
        setAuthPromptAction(null);
    };

    const handleProviderSignIn = async (provider) => {
        if (!authPromptAction) return;
        setAuthProcessing(true);
        try {
            if (provider === 'google') {
                await signIn();
            } else if (provider === 'apple') {
                await signInWithApple();
            }
            finishAuthSuccess();
        } catch (error) {
            console.error('Unable to sign in', error);
            setNotification({ open: true, message: 'Unable to sign in. Please try again.', severity: 'error' });
        } finally {
            setAuthProcessing(false);
        }
    };

    const handleNavigateLogin = (method) => {
        if (!authPromptAction) return;
        const actionToResume = authPromptAction;
        navigate('/login', {
            state: {
                method,
                from: location.pathname,
                resumeAction: actionToResume
            }
        });
        closeAuthPrompt();
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

    useEffect(() => {
        if (!user || !resumeAction) return;
        if (resumeAction === 'sender') {
            setViewMode('sender');
        } else if (resumeAction === 'receiver') {
            setViewMode('receiver');
        } else if (resumeAction === 'tap-card') {
            setTapCardPromptOpen(true);
        }
        navigate(location.pathname, { replace: true });
    }, [user, resumeAction, navigate, location.pathname]);

    const startTapCardFlow = location.state?.startTapCardFlow;

    useEffect(() => {
        if (!startTapCardFlow) return;
        if (user) {
            setTapCardPromptOpen(true);
            navigate(location.pathname, { replace: true });
        } else {
            navigate('/login', {
                state: {
                    from: '/exchange',
                    resumeAction: 'tap-card'
                }
            });
        }
    }, [startTapCardFlow, user, navigate, location.pathname]);

    // Filter cards based on tab
    const displayCards = tabValue === 0 ? cards :
        tabValue === 1 ? cards.filter(c => c.type === 'sent') :
            cards.filter(c => c.type === 'received');

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
        <>
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
                        onClick={() => requestAction('sender')}
                        sx={{ py: 2, borderRadius: 3 }}
                    >
                        Write Message
                    </Button>
                </Badge>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {displayCards.map((item) => (
                        <React.Fragment key={item.id}>
                            <Paper
                                onClick={() => handleCardClick(item)}
                                elevation={2}
                                sx={{
                                    p: 0,
                                    borderRadius: 4,
                                    bgcolor: 'background.paper',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    minHeight: 360,
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
                                            height: { xs: 240, sm: 280 },
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
                                        <Box sx={{ p: 3 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>{item.title}</Typography>
                                            {item.sender && (
                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>From: {item.sender}</Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary">{item.date}</Typography>
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
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity || 'info'}
                    icon={notification.severity === 'success' ? <CheckCircleOutlineIcon fontSize="inherit" /> : undefined}
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {Boolean(authPromptAction) && (
                <Box
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: (theme) => theme.zIndex.modal + 1,
                        display: 'flex'
                    }}
                >
                    <Paper
                        elevation={6}
                        sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 0,
                            bgcolor: 'rgba(255,255,255,0.98)',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: { xs: 3, md: 6 }
                        }}
                    >
                        <IconButton
                            onClick={closeAuthPrompt}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ width: '100%', maxWidth: 520 }}>
                            <Stack spacing={1.5} alignItems="center">
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: '"Adelia", "Pacifico", cursive',
                                        background: 'linear-gradient(45deg, #0088FF 30%, #00C6FF 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    Homer
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                                    {authPromptAction === 'sender' ? 'Save Your Memory' : 'Unlock This Memory'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                                    {authPromptAction === 'sender'
                                        ? 'We attach every embedded story to your Homer account so you can edit it, share it, and keep it safe across devices.'
                                        : 'Reading a memory registers it in your locker so you always know who shared it and never lose access.'}
                                </Typography>
                            </Stack>
                            <Stack spacing={2} sx={{ mt: 4 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<GoogleIcon />}
                                    onClick={() => handleProviderSignIn('google')}
                                    disabled={authProcessing}
                                    sx={{ borderRadius: 50 }}
                                >
                                    Continue with Google
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<AppleIcon />}
                                    onClick={() => handleProviderSignIn('apple')}
                                    disabled={authProcessing}
                                    sx={{ borderRadius: 50, borderColor: '#ddd' }}
                                >
                                    Continue with Apple
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<MailOutlineIcon />}
                                    onClick={() => handleNavigateLogin('email')}
                                    sx={{ borderRadius: 50, borderColor: '#ddd' }}
                                >
                                    Continue with Email
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<TextsmsIcon />}
                                    onClick={() => handleNavigateLogin('sms')}
                                    sx={{ borderRadius: 50, borderColor: '#ddd' }}
                                >
                                    Continue with SMS
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>
                </Box>
            )}
        </Box>

        <Dialog
            open={tapCardPromptOpen}
            onClose={closeTapCardPrompt}
            fullScreen
            PaperProps={{
                sx: {
                    bgcolor: 'rgba(0,0,0,0.7)',
                    borderRadius: 0
                }
            }}
        >
            <DialogContent
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 0,
                    p: { xs: 4, md: 6 },
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={closeTapCardPrompt}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogTitle sx={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold', pb: 1 }}>
                    Tap Card
                </DialogTitle>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Choose what you’d like to do with your Homer card.
                </Typography>
                <Stack spacing={2}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<CreateIcon />}
                        onClick={() => handleTapCardChoice('sender')}
                        sx={{ borderRadius: 3, py: 1.5 }}
                    >
                        Embed a Memory
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<NfcIcon />}
                        onClick={() => handleTapCardChoice('receiver')}
                        sx={{ borderRadius: 3, py: 1.5, borderWidth: 2 }}
                    >
                        Read a Memory
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
        </>
    );
};

export default Exchange;
