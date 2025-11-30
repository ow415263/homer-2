import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Typography, Paper, Container, TextField, Stack, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../lib/firebaseAuth';

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
    const renderEmailForm = () => (
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
    );
            >
                Sign in with Apple
            </Button>
            <Divider>OR</Divider>
            <Button
                variant="outlined"
                size="large"
                startIcon={<EmailIcon />}
                onClick={() => setMode('email')}
                fullWidth
                sx={{ borderRadius: 50, borderColor: '#ddd', color: 'text.primary' }}
            >
                Continue with Email
            </Button>
            <Button
                variant="outlined"
                size="large"
                startIcon={<PhoneIcon />}
                onClick={() => setMode('phone')}
                fullWidth
                sx={{ borderRadius: 50, borderColor: '#ddd', color: 'text.primary' }}
            >
                Continue with Phone
            </Button>
        </Stack>
    );

    const renderEmailMode = () => (
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
                {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
            <Button
                onClick={() => setIsSignUp(!isSignUp)}
                fullWidth
                sx={{ mt: 1, textTransform: 'none' }}
            >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>
            <Button
                onClick={() => setMode('select')}
                fullWidth
                sx={{ mt: 1, textTransform: 'none', color: 'text.secondary' }}
            >
                Back
            </Button>
        </Box>
    );

    const renderPhoneMode = () => (
        <Box width="100%">
            {!confirmationResult ? (
                <Box component="form" onSubmit={handleSendCode}>
                    <TextField
                        label="Phone Number (e.g., +15555555555)"
                        fullWidth
                        margin="normal"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <div id="recaptcha-container"></div>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 2, borderRadius: 50 }}
                    >
                        Send Code
                    </Button>
                </Box>
            ) : (
                <Box component="form" onSubmit={handleVerifyCode}>
                    <TextField
                        label="Verification Code"
                        fullWidth
                        margin="normal"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 2, borderRadius: 50 }}
                    >
                        Verify Code
                    </Button>
                </Box>
            )}
            <Button
                onClick={() => {
                    setMode('select');
                    setConfirmationResult(null);
                }}
                fullWidth
                sx={{ mt: 1, textTransform: 'none', color: 'text.secondary' }}
            >
                Back
            </Button>
        </Box>
    );

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
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    {renderEmailForm()}
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
