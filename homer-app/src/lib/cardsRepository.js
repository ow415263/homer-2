import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const userCardsCollection = (uid) => collection(db, 'users', uid, 'cards');
const userCardDoc = (uid, cardId) => doc(db, 'users', uid, 'cards', cardId);
const cardShareDoc = (token) => doc(db, 'cardShares', token);
const cardShareReadsCollection = (token) => collection(cardShareDoc(token), 'reads');

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

export const updateCardShareMetadata = async (uid, cardId, metadata = {}) => {
  if (!uid || !cardId) {
    throw new Error('uid and cardId are required to update share metadata');
  }

  const payload = {
    ...metadata,
    lastSharedAt: serverTimestamp(),
  };

  if (metadata.shareToken === undefined) {
    delete payload.shareToken;
  }
  if (metadata.shareUrl === undefined) {
    delete payload.shareUrl;
  }
  if (metadata.nfcTagId === undefined) {
    delete payload.nfcTagId;
  }

  await updateDoc(userCardDoc(uid, cardId), payload);
};

export const saveCardShareMapping = async ({
  token,
  ownerId,
  cardId,
  shareUrl,
  nfcTagId,
  cardSnapshot,
}) => {
  if (!token || !ownerId || !cardId) {
    throw new Error('token, ownerId, and cardId are required to save a share mapping');
  }

  await setDoc(
    cardShareDoc(token),
    {
      ownerId,
      cardId,
      shareUrl: shareUrl || null,
      nfcTagId: nfcTagId || null,
      card: cardSnapshot || null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const getCardByShareToken = async (token) => {
  if (!token) return null;

  const shareSnapshot = await getDoc(cardShareDoc(token));
  if (!shareSnapshot.exists()) {
    return null;
  }

  const shareData = shareSnapshot.data();
  if (!shareData.ownerId || !shareData.cardId) {
    return null;
  }

  const cardData = shareData.card || {};

  return {
    id: shareData.cardId,
    ownerId: shareData.ownerId,
    ...cardData,
    share: {
      token,
      ...shareData,
    },
  };
};

export const logCardShareRead = async ({ token, readerId, context }) => {
  if (!token) {
    throw new Error('token is required to log a card read');
  }

  await addDoc(cardShareReadsCollection(token), {
    readerId: readerId || null,
    context: context || 'nfc',
    readAt: serverTimestamp(),
  });
};
