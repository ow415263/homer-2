import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Typography, Paper, Container, TextField, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const LOGIN_RETURN_PATH_KEY = 'homer:returnPath';
    const LOGIN_RESUME_ACTION_KEY = 'homer:resumeAction';

    const {
        user,
        loading: authLoading,
        signInWithEmail,
        signUpWithEmail
    } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state || {};
    const fromPath = locationState.from || '/';
    const resumeAction = locationState.resumeAction;

    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const getStoredValue = (key) => {
        if (typeof window === 'undefined') return null;
        return window.sessionStorage.getItem(key);
    };

    const setStoredValue = (key, value) => {
        if (typeof window === 'undefined') return;
        if (value === undefined || value === null || value === '') {
            window.sessionStorage.removeItem(key);
        } else {
            window.sessionStorage.setItem(key, value);
        }
    };

    useEffect(() => {
        if (locationState.from) {
            setStoredValue(LOGIN_RETURN_PATH_KEY, locationState.from);
        }
        if (typeof locationState.resumeAction !== 'undefined') {
            setStoredValue(LOGIN_RESUME_ACTION_KEY, locationState.resumeAction);
        }
    }, [locationState.from, locationState.resumeAction]);

    const clearStoredIntent = () => {
        if (typeof window === 'undefined') return;
        window.sessionStorage.removeItem(LOGIN_RETURN_PATH_KEY);
        window.sessionStorage.removeItem(LOGIN_RESUME_ACTION_KEY);
    };

    const navigateAfterAuth = useCallback(() => {
        const storedFromPath = getStoredValue(LOGIN_RETURN_PATH_KEY);
        const storedResume = getStoredValue(LOGIN_RESUME_ACTION_KEY);
        const nextFrom = fromPath || storedFromPath || '/';
        const nextResume = typeof resumeAction !== 'undefined'
            ? resumeAction
            : storedResume;

        clearStoredIntent();

        if (nextResume) {
            navigate(nextFrom, { replace: true, state: { resumeAction: nextResume } });
        } else {
            navigate(nextFrom, { replace: true });
        }
    }, [fromPath, resumeAction, navigate]);

    useEffect(() => {
        if (authLoading) return;
        if (user) {
            navigateAfterAuth();
        }
    }, [user, authLoading, navigateAfterAuth]);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (isSignUp) {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
            navigateAfterAuth();
        } catch (authError) {
            console.error('Error with email auth:', authError);
            setError(authError.message || 'Failed to authenticate');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
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
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleEmailAuth} width="100%">
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 2, borderRadius: 50 }}
                        >
                            {isSignUp ? 'Create account' : 'Sign in'}
                        </Button>
                        <Button
                            variant="text"
                            fullWidth
                            onClick={() => setIsSignUp(!isSignUp)}
                            sx={{ mt: 1 }}
                        >
                            {isSignUp ? 'Have an account? Sign in' : 'New to Homer? Create an account'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
