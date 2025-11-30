import React from 'react';
import { Box, Typography, IconButton, Button, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NfcIcon from '@mui/icons-material/Nfc';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isProfilePage = location.pathname === '/profile';
    const { user, profile } = useAuth();
    const avatarSrc = profile?.photoURL || user?.photoURL || null;
    const avatarAlt = profile?.displayName || user?.displayName || 'Profile';

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const handleTapCard = () => {
        if (user) {
            navigate('/exchange', { state: { resumeAction: 'sender' } });
            return;
        }

        navigate('/login', {
            state: {
                from: '/exchange',
                resumeAction: 'sender'
            }
        });
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 64,
            bgcolor: 'primary.main',
            color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isProfilePage ? 'flex-start' : 'space-between',
                px: 3,
                zIndex: 1100,
                boxShadow: 2
            }}
        >
            {isProfilePage ? (
                <IconButton
                    onClick={handleBack}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            ) : (
                <>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: '"Adelia", "Pacifico", cursive',
                            fontSize: { xs: '1.2rem', sm: '1.4rem' },
                            fontWeight: 400,
                            cursor: 'pointer',
                            color: 'white'
                        }}
                        onClick={() => navigate('/')}
                    >
                        Homer
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<NfcIcon />}
                            onClick={handleTapCard}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                bgcolor: 'white',
                                color: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                }
                            }}
                        >
                            Tap Card
                        </Button>
                        {user ? (
                            <IconButton
                                onClick={() => navigate('/profile')}
                                sx={{
                                    color: 'white',
                                    bgcolor: 'transparent',
                                    p: 0.5,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                {avatarSrc ? (
                                    <Avatar
                                        src={avatarSrc}
                                        alt={avatarAlt}
                                        sx={{ width: 36, height: 36, border: '2px solid rgba(255,255,255,0.6)' }}
                                    />
                                ) : (
                                    <PersonIcon />
                                )}
                            </IconButton>
                        ) : (
                            <Button
                                color="inherit"
                                onClick={() => navigate('/login')}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Header;
