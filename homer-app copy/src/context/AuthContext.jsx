import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, onAuthStateChanged, signInWithGoogle, signOutUser } from '../lib/firebaseAuth';

const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        signIn: signInWithGoogle,
        signOut: signOutUser
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
