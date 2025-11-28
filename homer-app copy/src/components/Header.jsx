import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isProfilePage = location.pathname === '/profile';
    const isCardsPage = location.pathname === '/cards';

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const handleCreateCard = () => {
        // TODO: Open create card flow/dialog
        console.log('Create custom card clicked');
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
                            fontFamily: '"Pacifico", cursive',
                            fontWeight: 'normal',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/')}
                    >
                        Homer
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isCardsPage && (
                            <Button
                                variant="outlined"
                                onClick={handleCreateCard}
                                startIcon={<AutoFixHighIcon />}
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Custom
                            </Button>
                        )}
                        <IconButton
                            onClick={() => navigate('/profile')}
                            sx={{
                                color: 'white',
                                bgcolor: 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            <PersonIcon />
                        </IconButton>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Header;
