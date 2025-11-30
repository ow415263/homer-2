import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const userDocRef = (uid) => doc(db, 'users', uid);

export const subscribeToUserProfile = (uid, onProfile, onError) =>
    onSnapshot(
        userDocRef(uid),
        (snapshot) => {
            if (!snapshot.exists()) {
                onProfile(null);
                return;
            }
            const data = snapshot.data();
            onProfile(data.profile ?? data);
        },
        (error) => onError?.(error)
    );

export const saveUserProfile = async (uid, profile) =>
    setDoc(
        userDocRef(uid),
        {
            profile: {
                ...profile,
                updatedAt: serverTimestamp()
            },
            lastProfileUpdate: serverTimestamp()
        },
        { merge: true }
    );
