import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Container, TextField, Divider, Stack, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../lib/firebaseAuth';

const Login = () => {
    const { signIn, signInWithApple, signInWithEmail, signUpWithEmail, signInWithPhone } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [mode, setMode] = useState('select'); // select, email, phone
    const [isSignUp, setIsSignUp] = useState(false);

    // Email State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Phone State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

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

    const handleAppleSignIn = async () => {
        try {
            setError('');
            await signInWithApple();
            navigate('/');
        } catch (error) {
            console.error('Error signing in with Apple:', error);
            setError(error.message || 'Failed to sign in');
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (isSignUp) {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
            navigate('/');
        } catch (error) {
            console.error('Error with email auth:', error);
            setError(error.message || 'Failed to authenticate');
        }
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'normal',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                }
            });
        }
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhone(phoneNumber, appVerifier);
            setConfirmationResult(result);
        } catch (error) {
            console.error('Error sending code:', error);
            setError(error.message || 'Failed to send code');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await confirmationResult.confirm(verificationCode);
            navigate('/');
        } catch (error) {
            console.error('Error verifying code:', error);
            setError(error.message || 'Invalid code');
        }
    };

    const renderSelectMode = () => (
        <Stack spacing={2} width="100%">
            <Button
                variant="outlined"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                fullWidth
                sx={{ borderRadius: 50, borderColor: '#ddd', color: 'text.primary' }}
            >
                Sign in with Google
            </Button>
            <Button
                variant="outlined"
                size="large"
                startIcon={<AppleIcon />}
                onClick={handleAppleSignIn}
                fullWidth
                sx={{ borderRadius: 50, borderColor: '#ddd', color: 'text.primary' }}
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
                        {mode === 'select' ? 'Welcome Back' : mode === 'email' ? (isSignUp ? 'Create Account' : 'Sign In') : 'Phone Sign In'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    {mode === 'select' && renderSelectMode()}
                    {mode === 'email' && renderEmailMode()}
                    {mode === 'phone' && renderPhoneMode()}
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
