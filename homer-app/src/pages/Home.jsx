import React from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PublicIcon from '@mui/icons-material/Public';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';

const Home = () => {
    return (
        <Box sx={{ pb: 8 }}>
            {/* Hero Section */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #0088FF 30%, #00C6FF 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    Welcome to Homer
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Deeper connections through NFC-enabled cards
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Share memories that last forever
                </Typography>
            </Box>

            {/* How It Works Section */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon /> How Homer Works
                </Typography>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">1. Get Your Card</Typography>
                        <Typography variant="body2">
                            Find Homer cards at vendors around the world or order your own custom designs
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">2. Embed Your Memory</Typography>
                        <Typography variant="body2">
                            Add photos, videos, messages, and location data to your NFC card
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">3. Share & Connect</Typography>
                        <Typography variant="body2">
                            Send your card and let them tap to unlock your special memory
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Physical Cards Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CardGiftcardIcon color="primary" /> NFC Cards
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Our premium NFC-enabled cards combine the tangible joy of physical postcards with the magic of digital memories.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label="Available Worldwide" icon={<PublicIcon />} color="primary" variant="outlined" />
                    <Chip label="Custom Designs" color="primary" variant="outlined" />
                    <Chip label="Reusable" color="primary" variant="outlined" />
                </Stack>
            </Paper>

            {/* E-Cards Section */}
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: 'grey.100'
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="action" /> E-Cards
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Send digital memories instantly without a physical card. Perfect for last-minute occasions and global connections.
                    </Typography>
                    <Chip
                        label="Coming Soon"
                        color="default"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            py: 2.5,
                            px: 2
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        opacity: 0.05,
                        background: 'repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)'
                    }}
                />
            </Paper>
        </Box>
    );
};

export default Home;
