import React, { useState, useRef } from 'react';
import { Box, Typography, Button, IconButton, Paper, Grid } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import MapIcon from '@mui/icons-material/Map';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DownloadIcon from '@mui/icons-material/Download';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';

const containerStyle = {
    width: '100%',
    height: '300px'
};

const center = {
    lat: 48.8566,
    lng: 2.3522 // Paris
};

const ReceiverFlow = ({ apiKey, cardData, onExit, layoutId }) => {
    const [showMap, setShowMap] = useState(false);
    const [fullscreenIndex, setFullscreenIndex] = useState(null);
    const containerRef = useRef(null);

    // Use cardData if provided, otherwise fallback to defaults (or empty)
    const { title, description, media, location } = cardData || {
        title: 'Trip to Paris',
        description: 'Had an amazing time visiting the Eiffel Tower! Wish you were here.',
        media: [],
        location: center
    };

    // Handle both array and single media URL (legacy support)
    const mediaArray = Array.isArray(media) ? media : (media ? [{ url: media, type: 'image/jpeg' }] : []);

    // Mock images if no media
    const mockMedia = [
        { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', type: 'image/jpeg' },
        { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80', type: 'image/jpeg' },
        { url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80', type: 'image/jpeg' },
    ];

    const displayMedia = mediaArray.length > 0 ? mediaArray : mockMedia;

    const handleDownload = () => {
        displayMedia.forEach((media, index) => {
            const link = document.createElement('a');
            link.href = media.url;
            link.download = `media-${index + 1}${media.type.startsWith('video/') ? '.mp4' : '.jpg'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const handlePrevious = () => {
        setFullscreenIndex((prev) => (prev > 0 ? prev - 1 : displayMedia.length - 1));
    };

    const handleNext = () => {
        setFullscreenIndex((prev) => (prev < displayMedia.length - 1 ? prev + 1 : 0));
    };

    return (
        <Box
            component={motion.div}
            layoutId={layoutId}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
                bgcolor: 'background.paper',
                overflowY: 'auto'
            }}
        >
            {/* Sticky Header Section */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                zIndex: 1002,
                px: 2,
                py: 2,
                pt: 3
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                    <Box>
                        <IconButton onClick={() => setShowMap(!showMap)} color="primary" sx={{ mr: 1 }}>
                            {showMap ? <ViewCarouselIcon /> : <MapIcon />}
                        </IconButton>
                        <IconButton onClick={onExit} color="default">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description}
                </Typography>

                {/* Buttons side by side */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        size="small"
                        onClick={handleDownload}
                        sx={{ flex: 1 }}
                    >
                        Download All ({displayMedia.length})
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<ViewInArIcon />}
                        size="small"
                        sx={{ flex: 1 }}
                    >
                        View in AR
                    </Button>
                </Box>
            </Box>

            {/* Main Content - with top padding for sticky header */}
            <Box ref={containerRef} sx={{ pt: 25, px: 2, pb: 10, minHeight: '80vh' }}>
                {showMap ? (
                    <LoadScript googleMapsApiKey={apiKey}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={location || center}
                            zoom={13}
                        >
                            <Marker position={location || center} />
                        </GoogleMap>
                    </LoadScript>
                ) : (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {displayMedia.map((media, index) => (
                            <Grid item xs={12} key={index}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scale(1.02)' }
                                    }}
                                    onClick={() => setFullscreenIndex(index)}
                                >
                                    {media.type.startsWith('video/') ? (
                                        <video
                                            src={media.url}
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                    ) : (
                                        <img
                                            src={media.url}
                                            alt={`Memory ${index + 1}`}
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Fullscreen Viewer */}
            {fullscreenIndex !== null && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.95)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={() => setFullscreenIndex(null)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Previous Button */}
                    <IconButton
                        onClick={handlePrevious}
                        sx={{
                            position: 'absolute',
                            left: 16,
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <ChevronLeftIcon fontSize="large" />
                    </IconButton>

                    {/* Media Display */}
                    <Box sx={{ maxWidth: '90%', maxHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {displayMedia[fullscreenIndex].type.startsWith('video/') ? (
                            <video
                                src={displayMedia[fullscreenIndex].url}
                                controls
                                style={{ maxWidth: '100%', maxHeight: '90vh' }}
                            />
                        ) : (
                            <img
                                src={displayMedia[fullscreenIndex].url}
                                alt={`Fullscreen ${fullscreenIndex + 1}`}
                                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                            />
                        )}
                    </Box>

                    {/* Next Button */}
                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            color: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <ChevronRightIcon fontSize="large" />
                    </IconButton>

                    {/* Image Counter */}
                    <Typography
                        variant="body1"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            px: 2,
                            py: 1,
                            borderRadius: 2
                        }}
                    >
                        {fullscreenIndex + 1} / {displayMedia.length}
                    </Typography>

                    {/* Action Buttons in Fullscreen */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1,
                        width: '90%',
                        maxWidth: 400
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            sx={{
                                flex: 1,
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Download All ({displayMedia.length})
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<ViewInArIcon />}
                            sx={{ flex: 1, bgcolor: 'primary.main' }}
                        >
                            View in AR
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ReceiverFlow;
