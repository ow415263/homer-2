import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    auth,
    onAuthStateChanged,
    signInWithGoogle,
    signInWithApple,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPhoneNumber,
    signOutUser
} from '../lib/firebaseAuth';
import { subscribeToUserProfile } from '../lib/profileRepository';

const AuthContext = createContext({ user: null, loading: true, profile: null, profileLoading: true });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setProfileLoading(false);
            return;
        }

        setProfileLoading(true);
        const unsubscribeProfile = subscribeToUserProfile(
            user.uid,
            (data) => {
                setProfile(data);
                setProfileLoading(false);
            },
            (error) => {
                console.error('Failed to load profile preferences', error);
                setProfile(null);
                setProfileLoading(false);
            }
        );

        return unsubscribeProfile;
    }, [user]);

    const value = useMemo(() => ({
        user,
        loading,
        profile,
        profileLoading,
        signIn: signInWithGoogle,
        signInWithApple,
        signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
        signUpWithEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
        signInWithPhone: (phoneNumber, appVerifier) => signInWithPhoneNumber(auth, phoneNumber, appVerifier),
        signOut: signOutUser
    }), [user, loading, profile, profileLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
