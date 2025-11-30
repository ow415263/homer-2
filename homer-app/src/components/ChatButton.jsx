import React, { useState } from 'react';
import { IconButton, Box, useTheme, useMediaQuery } from '@mui/material';
import ChatInterface from './ChatInterface';
import homerLogo from '../assets/Homer_Logo.svg';

const ChatButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
    const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));
    const chatOffset = isXlUp ? 230 : isLgUp ? 190 : 170;

    const handleToggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: { xs: 12, md: 20 },
                    right: 16,
                    left: { xs: 'auto', md: '50%' },
                    transform: {
                        xs: 'none',
                        md: `translateX(calc(-50% + ${chatOffset}px))`, // Keep desktop alignment with nav
                    },
                    zIndex: 1100,
                    borderRadius: 999,
                    overflow: 'hidden',
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    boxShadow: 'none',
                    border: '1px solid rgba(15, 23, 42, 0.15)',
                    ml: { md: 1.5 }
                }}
            >
                <IconButton
                    onClick={handleToggleChat}
                    sx={{
                        width: '100%',
                        height: '100%',
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                        borderRadius: 'inherit',
                        '&:hover': {
                            bgcolor: 'rgba(15, 23, 42, 0.05)'
                        }
                    }}
                >
                    <Box
                        component="img"
                        src={homerLogo}
                        alt="Open Homer chat"
                        sx={{ width: 40, height: 40 }}
                    />
                </IconButton>
            </Box>

            {isChatOpen && <ChatInterface onClose={handleToggleChat} />}
        </>
    );
};

export default ChatButton;
