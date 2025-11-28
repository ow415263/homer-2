import React, { useState } from 'react';
import { IconButton, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatInterface from './ChatInterface';

const ChatButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleToggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(calc(-50% + 170px))', // Position to the right of nav with more spacing
                    zIndex: 1000,
                    borderRadius: 50,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    ml: 1.5 // Add margin-left for spacing between nav and chat
                }}
            >
                <IconButton
                    onClick={handleToggleChat}
                    sx={{
                        width: 64,
                        height: 64, // Match nav height
                        color: 'primary.main',
                        '&:hover': {
                            bgcolor: 'rgba(0, 136, 255, 0.1)'
                        }
                    }}
                >
                    <ChatIcon fontSize="medium" />
                </IconButton>
            </Box>

            {isChatOpen && <ChatInterface onClose={handleToggleChat} />}
        </>
    );
};

export default ChatButton;
