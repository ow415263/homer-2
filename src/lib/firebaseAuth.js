import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const appleProvider = new OAuthProvider('apple.com');

const isIosSafariLike = () => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isIOS = /iP(ad|hone|od)/i.test(ua);
    if (!isIOS) return false;
    const isMobileSafari = /Safari/i.test(ua) && !/(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua);
    const isStandalonePwa = typeof window !== 'undefined' && window.navigator?.standalone;
    return isMobileSafari || isStandalonePwa;
};

const shouldFallbackToRedirect = (error) => {
    if (!error?.code) return false;
    const fallbackCodes = new Set([
        'auth/operation-not-supported-in-this-environment',
        'auth/auth-domain-config-required',
        'auth/popup-blocked',
        'auth/web-storage-unsupported'
    ]);
    return fallbackCodes.has(error.code);
};

const signInWithGoogle = async () => {
    if (isIosSafariLike()) {
        return signInWithRedirect(auth, googleProvider);
    }
    try {
        return await signInWithPopup(auth, googleProvider);
    } catch (error) {
        if (shouldFallbackToRedirect(error)) {
            return signInWithRedirect(auth, googleProvider);
        }
        throw error;
    }
};

const signInWithApple = async () => {
    if (isIosSafariLike()) {
        return signInWithRedirect(auth, appleProvider);
    }
    try {
        return await signInWithPopup(auth, appleProvider);
    } catch (error) {
        if (shouldFallbackToRedirect(error)) {
            return signInWithRedirect(auth, appleProvider);
        }
        throw error;
    }
};
const signOutUser = () => signOut(auth);

export {
    auth,
    onAuthStateChanged,
    signInWithGoogle,
    signInWithApple,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOutUser
};
