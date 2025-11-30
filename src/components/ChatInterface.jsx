import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, TextField, IconButton, Typography, Paper, CircularProgress, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import OpenAI from 'openai';
import homerLogo from '../assets/Homer_Logo.svg';

const ChatInterface = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your Homer assistant. I can help you with creating memories, using NFC cards, and navigating the app. How can I help you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const openai = useMemo(() => {
        if (!apiKey) {
            console.warn('Missing VITE_OPENAI_API_KEY. The chat assistant will be disabled.');
            return null;
        }

        return new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true // Required for client-side usage
        });
    }, [apiKey]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        if (!openai) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'AI chat is not available because no OpenAI API key is configured.'
                }
            ]);
            return;
        }

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant for Homer, an app that enables deeper connections through NFC-enabled cards. Homer allows users to embed photos, videos, messages, and location data into physical NFC cards that can be sent to loved ones. Users can also tap cards to view memories. Help users understand how to use the app, create memories, and connect with others.'
                    },
                    ...messages,
                    userMessage
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.choices[0].message.content
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('OpenAI API Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        component="img"
                        src={homerLogo}
                        alt="Homer logo"
                        sx={{ width: 64, height: 64, filter: 'brightness(0) invert(1)' }}
                    />
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'Adelia, cursive',
                                lineHeight: 1,
                                color: 'white',
                                fontSize: 14
                            }}
                        >
                            Homer
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'white' }}>
                            Assistant · Powered by AI
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Messages */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                maxWidth: '75%',
                                borderRadius: 3,
                                bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                                color: message.role === 'user' ? 'white' : 'text.primary'
                            }}
                        >
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {message.content}
                            </Typography>
                        </Paper>
                    </Box>
                ))}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: 'grey.100' }}>
                            <CircularProgress size={20} />
                        </Paper>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box
                sx={{
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}
            >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about Homer..."
                        variant="outlined"
                        disabled={isLoading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        sx={{
                            minWidth: 56,
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            boxShadow: 2,
                            '&:hover': {
                                boxShadow: 4
                            }
                        }}
                    >
                        <SendIcon />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatInterface;
