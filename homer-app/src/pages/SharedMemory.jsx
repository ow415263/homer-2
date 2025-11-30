import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ReceiverFlow from '../components/ReceiverFlow';
import { GOOGLE_MAPS_API_KEY } from '../lib/maps';
import { getCardByShareToken, logCardShareRead } from '../lib/cardsRepository';
import { useLayout } from '../context/LayoutContext';
import { useAuth } from '../context/AuthContext';

const SharedMemory = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { setIsFullscreen } = useLayout();
    const { user } = useAuth();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsFullscreen(true);
        return () => setIsFullscreen(false);
    }, [setIsFullscreen]);

    useEffect(() => {
        let isMounted = true;
        const loadCard = async () => {
            if (!token) {
                setError('Missing card link.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const result = await getCardByShareToken(token);
                if (!result) {
                    throw new Error('This card has not been linked yet or was removed.');
                }
                if (!isMounted) return;
                setCard(result);
                logCardShareRead({ token, readerId: user?.uid || null, context: 'link' }).catch((logError) => {
                    console.warn('Unable to record card read', logError);
                });
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || 'Unable to load this memory.');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadCard();
        return () => {
            isMounted = false;
        };
    }, [token, user]);

    const handleExit = () => {
        navigate('/exchange', { replace: true });
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !card) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 3, p: 4 }}>
                <Typography variant="h5" fontWeight="bold">
                    Unable to open this memory
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {error || 'Something went wrong.'}
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/exchange')}>
                    Go to Exchange
                </Button>
            </Box>
        );
    }

    const cardData = {
        title: card.title,
        description: card.description || (card.sender ? `From: ${card.sender}` : 'Shared memory'),
        media: card.media?.length
            ? card.media
            : card.image
                ? [{ url: card.image, type: 'image/jpeg' }]
                : [],
        date: card.date,
        location: card.location
    };

    return (
        <ReceiverFlow
            apiKey={GOOGLE_MAPS_API_KEY}
            cardData={cardData}
            onExit={handleExit}
        />
    );
};

export default SharedMemory;
