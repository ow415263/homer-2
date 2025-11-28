import React from 'react';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            await signIn();
            navigate('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError(error.message || 'Failed to sign in');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            mb: 2,
                            fontFamily: '"Adelia", "Pacifico", cursive',
                            background: 'linear-gradient(45deg, #0088FF 30%, #00C6FF 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        Homer
                    </Typography>

                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 'medium' }}>
                        Welcome Back
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Sign in to access your cards and memories
                    </Typography>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleSignIn}
                        sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: 50,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            borderColor: '#ddd',
                            color: 'text.primary',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'rgba(0, 136, 255, 0.04)'
                            }
                        }}
                    >
                        Sign in with Google
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
