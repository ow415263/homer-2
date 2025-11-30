import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Paper,
    Divider,
    Button,
    CircularProgress,
    TextField,
    Stack,
    MenuItem,
    Alert,
    FormControlLabel,
    Switch
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { sentPostcards, receivedPostcards } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserProfile, saveUserProfile } from '../lib/profileRepository';
import { uploadMedia } from '../lib/db';

const travelStyles = ['Explorer', 'Planner', 'Foodie', 'Art Lover', 'Nature Seeker'];
const defaultProfileForm = {
    preferredName: '',
    homeBase: '',
    travelStyle: 'Explorer',
    story: '',
    photoURL: '',
    shareLocation: false
};

const Profile = () => {
    const sentCount = sentPostcards.length;
    const receivedCount = receivedPostcards.length;
    const { user, loading, signIn, signOut } = useAuth();
    const [authError, setAuthError] = useState(null);

    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [profileAlert, setProfileAlert] = useState(null);
    const fileInputRef = useRef(null);
    const [profileForm, setProfileForm] = useState(defaultProfileForm);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setProfileLoading(false);
            return;
        }

        setProfileLoading(true);
        const unsubscribe = subscribeToUserProfile(
            user.uid,
            (data) => {
                setProfile(data);
                setProfileLoading(false);
            },
            (error) => {
                console.error('Failed to load onboarding profile', error);
                setProfileAlert({ type: 'error', message: error.message || 'Unable to load your profile preferences.' });
                setProfileLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    useEffect(() => {
        if (!user) {
            setProfileForm(defaultProfileForm);
            return;
        }

        setProfileForm({
            preferredName: profile?.displayName || user.displayName || '',
            homeBase: profile?.homeBase || '',
            travelStyle: profile?.travelStyle || 'Explorer',
            story: profile?.story || '',
            photoURL: profile?.photoURL || user.photoURL || '',
            shareLocation: Boolean(profile?.shareLocation)
        });
    }, [profile, user]);

    const userDetails = useMemo(() => ({
        name: profile?.displayName || user?.displayName || 'Traveler',
        email: user?.email || 'Sign in to sync your memories',
        photoURL: profile?.photoURL || user?.photoURL || null,
        travelStyle: profile?.travelStyle,
        homeBase: profile?.homeBase
    }), [user, profile]);

    const handleSignIn = async () => {
        setAuthError(null);
        try {
            await signIn();
        } catch (error) {
            setAuthError(error.message || 'Unable to sign in. Please try again.');
        }
    };

    const handleSignOut = async () => {
        setAuthError(null);
        try {
            await signOut();
        } catch (error) {
            setAuthError(error.message || 'Unable to sign out. Please try again.');
        }
    };

    const handleProfileChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setProfileForm((prev) => ({ ...prev, [field]: value }));
    };

    const handlePhotoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;
        setPhotoUploading(true);
        setProfileAlert(null);
        try {
            const uploadResult = await uploadMedia(file, `profiles/${user.uid}/${Date.now()}-${file.name}`);
            setProfileForm((prev) => ({ ...prev, photoURL: uploadResult.url }));
            setProfileAlert({ type: 'success', message: 'Photo uploaded. Save your profile to keep changes.' });
        } catch (error) {
            console.error('Unable to upload photo', error);
            setProfileAlert({ type: 'error', message: error.message || 'Unable to upload photo. Try another image.' });
        } finally {
            setPhotoUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleProfileSave = async () => {
        if (!user) return;
        setProfileSaving(true);
        setProfileAlert(null);
        try {
            await saveUserProfile(user.uid, {
                displayName: profileForm.preferredName,
                homeBase: profileForm.homeBase,
                travelStyle: profileForm.travelStyle,
                story: profileForm.story,
                photoURL: profileForm.photoURL,
                shareLocation: profileForm.shareLocation,
                onboardingComplete: true
            });
            setProfileAlert({ type: 'success', message: 'Profile preferences saved.' });
        } catch (error) {
            console.error('Failed to save profile', error);
            setProfileAlert({ type: 'error', message: error.message || 'Unable to save your details. Please try again.' });
        } finally {
            setProfileSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, pb: 10 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }} src={userDetails.photoURL}>
                    {!userDetails.photoURL && <PersonIcon sx={{ fontSize: 60 }} />}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">{userDetails.name}</Typography>
                <Typography variant="body2" color="text.secondary">{userDetails.email}</Typography>
                {userDetails.homeBase && (
                    <Typography variant="body2" color="text.secondary">
                        Home base: {userDetails.homeBase}
                    </Typography>
                )}
                {userDetails.travelStyle && (
                    <Typography variant="body2" color="text.secondary">
                        Travel style: {userDetails.travelStyle}
                    </Typography>
                )}
                <Button
                    variant={user ? 'outlined' : 'contained'}
                    onClick={user ? handleSignOut : handleSignIn}
                    sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    {user ? 'Sign out' : 'Sign in with Google'}
                </Button>
                {authError && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {authError}
                    </Typography>
                )}
            </Box>

            <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Your Journey</Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' },
                        gap: 2,
                        textAlign: 'center'
                    }}
                >
                    <Box>
                        <Typography variant="h3" color="primary.main" fontWeight="bold">
                            {sentCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cards Sent
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h3" color="secondary.main" fontWeight="bold">
                            {receivedCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cards Received
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {user && (
                <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 4, mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Personalize Homer
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Tell us a bit about you so we can tailor postcard prompts, map previews, and memory suggestions.
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Preferred name"
                            value={profileForm.preferredName}
                            onChange={handleProfileChange('preferredName')}
                            fullWidth
                        />
                        <TextField
                            label="Home base"
                            placeholder="City, Country"
                            value={profileForm.homeBase}
                            onChange={handleProfileChange('homeBase')}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Travel style"
                            value={profileForm.travelStyle}
                            onChange={handleProfileChange('travelStyle')}
                        >
                            {travelStyles.map((style) => (
                                <MenuItem key={style} value={style}>{style}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Share a favorite travel memory"
                            value={profileForm.story}
                            onChange={handleProfileChange('story')}
                            multiline
                            minRows={3}
                        />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                            <Button
                                variant="outlined"
                                component="label"
                                disabled={photoUploading}
                                sx={{ textTransform: 'none' }}
                            >
                                {photoUploading ? 'Uploading photo...' : 'Upload profile photo'}
                                <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                            </Button>
                            {profileForm.photoURL && (
                                <Avatar src={profileForm.photoURL} sx={{ width: 56, height: 56 }} />
                            )}
                        </Stack>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={profileForm.shareLocation}
                                    onChange={handleProfileChange('shareLocation')}
                                />
                            }
                            label="Show my home base on shared cards"
                        />
                        <Button
                            variant="contained"
                            onClick={handleProfileSave}
                            disabled={profileSaving || profileLoading}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            {profileSaving ? 'Saving...' : 'Save profile'}
                        </Button>
                        {profileAlert && (
                            <Alert severity={profileAlert.type} onClose={() => setProfileAlert(null)}>
                                {profileAlert.message}
                            </Alert>
                        )}
                    </Stack>
                </Paper>
            )}

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Account Settings</Typography>
                <Paper elevation={0} variant="outlined" sx={{ borderRadius: 4 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1">Edit Profile</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1">Notifications</Typography>
                    </Box>
                    <Divider />
                    {user && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body1" color="error" onClick={handleSignOut} sx={{ cursor: 'pointer' }}>
                                Log Out
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default Profile;
