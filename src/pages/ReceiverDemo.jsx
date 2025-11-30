import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ReceiverFlow from '../components/ReceiverFlow';
import { useAuth } from '../context/AuthContext';
import { useLayout } from '../context/LayoutContext';
import { addLocalReceivedCard } from '../lib/localReceivedCards';

const mockCardData = {
    title: 'Postcard from Homer Studio',
    description: 'A sneak peek at the Homer phygital experience. Tap into the story, explore the map, and feel the nostalgia.',
    location: {
        name: 'Homer Studio',
        city: 'Toronto',
        lat: 43.6532,
        lng: -79.3832
    },
    media: [
        {
            url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
            type: 'image/jpeg'
        },
        {
            url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
            type: 'image/jpeg'
        }
    ]
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCutvv7f2R1FV-ScEC_6gJfvMBCFAAYJdw';

const ReceiverDemo = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsFullscreen } = useLayout();

    useEffect(() => {
        setIsFullscreen(true);
        return () => setIsFullscreen(false);
    }, [setIsFullscreen]);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', {
                replace: true,
                state: {
                    from: location.pathname,
                    resumeAction: 'receiver-demo'
                }
            });
        }
    }, [user, loading, navigate, location.pathname]);

    useEffect(() => {
        if (loading || !user) return;
        const image = mockCardData.media?.[0]?.url;
        addLocalReceivedCard({
            demoId: 'receiver-demo',
            id: 'receiver-demo',
            title: mockCardData.title,
            description: mockCardData.description,
            date: new Date().toLocaleDateString(),
            image,
            type: 'received',
            sender: 'Homer Studio',
            media: mockCardData.media,
            location: mockCardData.location
        });
    }, [loading, user]);

    if (loading || !user) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh'
                }}
            >
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Preparing your postcard experience...
                </Typography>
            </Box>
        );
    }

    return (
        <ReceiverFlow
            apiKey={GOOGLE_MAPS_API_KEY}
            cardData={mockCardData}
            onExit={() => navigate('/cards', { replace: true })}
        />
    );
};

export default ReceiverDemo;
