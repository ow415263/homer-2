import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const userCardsCollection = (uid) => collection(db, 'users', uid, 'cards');

export const subscribeToUserCards = (uid, onCards, onError) => {
  const cardsQuery = query(userCardsCollection(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(
    cardsQuery,
    (snapshot) => {
      const cards = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onCards(cards);
    },
    onError,
  );
};

export const addUserCard = async (uid, card) => {
  const docRef = await addDoc(userCardsCollection(uid), {
    ...card,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};
