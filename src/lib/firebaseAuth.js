import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
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

const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
const signInWithApple = () => signInWithPopup(auth, appleProvider);
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
