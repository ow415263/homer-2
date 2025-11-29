import { db, storage } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Collection references
const cardsCollection = collection(db, 'cards');

// Upload media file to Firebase Storage
export const uploadMedia = async (file, path) => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
            url: downloadURL,
            type: file.type,
            path: snapshot.ref.fullPath
        };
    } catch (error) {
        console.error("Error uploading media:", error);
        throw error;
    }
};

// Create a new card in Firestore
export const createCard = async (userId, cardData) => {
    try {
        const docRef = await addDoc(cardsCollection, {
            ...cardData,
            userId,
            createdAt: serverTimestamp(),
            // Ensure date is stored as a timestamp or string consistently
            date: cardData.date || new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating card:", error);
        throw error;
    }
};

// Get cards for a specific user (or all public cards if we had that concept)
// For now, let's just get cards created by the user + received cards (mock logic for received)
export const getUserCards = async (userId) => {
    try {
        const q = query(
            cardsCollection,
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const cards = [];
        querySnapshot.forEach((doc) => {
            cards.push({ id: doc.id, ...doc.data() });
        });
        return cards;
    } catch (error) {
        console.error("Error fetching user cards:", error);
        throw error;
    }
};
