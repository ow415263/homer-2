import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Switch, FormControlLabel, CircularProgress, IconButton, Grid } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import gsap from 'gsap';

const SenderFlow = ({ onComplete, onExit }) => {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        // Pulsing animation removed as per user request
    }, []);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMediaPreviews(prev => [...prev, { url: reader.result, type: file.type }]);
                };
                reader.readAsDataURL(file);
            });
            // Reset the input value so the same file can be selected again
            event.target.value = '';
        }
    };

    const handleRemoveMedia = (index) => {
        setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
        }, 2000);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        // Pass captured data back to parent
        onComplete({
            media: mediaPreviews,
            title: title || 'New Memory',
            description: description,
            location: location,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
    };

    if (showSuccess) {
        return (
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                bgcolor: '#1D192B',
                color: 'white',
                zIndex: 9999,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4
            }}>
                <IconButton
                    onClick={handleCloseSuccess}
                    sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>Sent!</Typography>

                <Box sx={{ fontSize: '4rem', mb: 4 }}>🚀</Box>

                <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Your message has been embedded.
                </Typography>
                <Typography variant="body1" align="center">
                    Now drop your postcard in the mail!
                </Typography>
            </Box>
        );
    }

    return (
        <Box ref={containerRef} sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000, // Ensure it sits on top of everything (Nav is 1000, Header 1100)
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            overflowY: 'auto' // Allow scrolling if content is tall
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Write Message</Typography>
                <IconButton onClick={onExit} edge="end">
                    <CloseIcon />
                </IconButton>
            </Box>

            <TextField
                label="Title"
                fullWidth
                margin="normal"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                label="Location"
                fullWidth
                margin="normal"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                    endAdornment: <LocationOnIcon color="action" />
                }}
            />
            <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                type="file"
                accept="image/*,video/*"
                hidden
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Media Previews - Horizontal Scroll */}
            {mediaPreviews.length > 0 && (
                <Box sx={{
                    my: 2,
                    p: 2,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                        Selected Media ({mediaPreviews.length})
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        pb: 1, // Space for scrollbar
                        '::-webkit-scrollbar': { height: 6 },
                        '::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 3 }
                    }}>
                        {mediaPreviews.map((media, index) => (
                            <Box key={index} sx={{
                                width: 100,
                                height: 100,
                                flexShrink: 0,
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                bgcolor: 'grey.300',
                                border: '1px solid',
                                borderColor: 'grey.400'
                            }}>
                                {media.type.startsWith('video/') ? (
                                    <video
                                        src={media.url}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={media.url}
                                        alt={`Preview ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMedia(index);
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        p: 0.5,
                                        bgcolor: 'rgba(211, 47, 47, 0.9)', // error.main with opacity
                                        color: 'white',
                                        '&:hover': { bgcolor: 'error.dark' }
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Add Media Button - Always visible */}
            <Box
                onClick={() => fileInputRef.current.click()}
                sx={{
                    my: 2, p: 2,
                    border: '1px dashed grey',
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                }}
            >
                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                    {mediaPreviews.length > 0 ? 'Add More Photos/Videos' : 'Add Photos/Videos'}
                </Typography>
            </Box>

            <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable Geo-tagging"
                sx={{ mb: 4 }}
            />

            <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
                sx={{ mt: 'auto', py: 1.5 }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Embed Message'}
            </Button>
        </Box>
    );
};

export default SenderFlow;
