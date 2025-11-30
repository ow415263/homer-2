#!/usr/bin/env node
import admin from 'firebase-admin';
import { randomUUID } from 'node:crypto';

const SHARE_BASE_URL = (process.env.SHARE_BASE_URL || 'https://homer.cards').replace(/\/$/, '');

const requireCredential = () => {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.credential.applicationDefault();
  }

  throw new Error(
    'GOOGLE_APPLICATION_CREDENTIALS is not set. Point it to a Firebase service account JSON file before running this script.',
  );
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: requireCredential(),
  });
}

const db = admin.firestore();

const sanitizeCardForShare = (card = {}) => ({
  title: card.title || 'Shared Memory',
  description: card.description || '',
  date: card.date || new Date().toLocaleDateString(),
  image: card.image || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  media: Array.isArray(card.media) ? card.media : [],
  location: card.location || null,
  type: card.type || 'sent',
  sender: card.sender || 'Friend',
});

const buildShareUrl = (token) => `${SHARE_BASE_URL}/memory/${token}`;

const seedCardShare = async (uid, cardDoc) => {
  const cardData = cardDoc.data();
  const sanitizedCard = sanitizeCardForShare(cardData);
  let token = cardData.shareToken;
  if (!token) {
    token = randomUUID();
  }
  const shareUrl = cardData.shareUrl || buildShareUrl(token);

  const shareRef = db.collection('cardShares').doc(token);
  const shareSnap = await shareRef.get();

  const sharePayload = {
    ownerId: uid,
    cardId: cardDoc.id,
    shareUrl,
    nfcTagId: cardData.nfcTagId || null,
    card: sanitizedCard,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (!shareSnap.exists) {
    sharePayload.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await shareRef.set(sharePayload, { merge: true });
  await cardDoc.ref.set({
    shareToken: token,
    shareUrl,
    lastSharedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  const operation = shareSnap.exists ? 'updated' : 'created';
  return { token, shareUrl, operation };
};

const main = async () => {
  console.log('Starting card share seeding...');
  const usersSnapshot = await db.collection('users').get();
  let processedUsers = 0;
  let processedCards = 0;
  let createdShares = 0;
  let updatedShares = 0;

  for (const userDoc of usersSnapshot.docs) {
    processedUsers += 1;
    const cardsSnapshot = await userDoc.ref.collection('cards').get();
    if (cardsSnapshot.empty) continue;

    for (const cardDoc of cardsSnapshot.docs) {
      processedCards += 1;
      try {
        const result = await seedCardShare(userDoc.id, cardDoc);
        if (result.operation === 'created') {
          createdShares += 1;
        } else {
          updatedShares += 1;
        }
        console.log(`\t${result.operation.toUpperCase()}: ${userDoc.id}/${cardDoc.id} -> ${result.token}`);
      } catch (error) {
        console.error(`\tFAILED: ${userDoc.id}/${cardDoc.id}`, error);
      }
    }
  }

  console.log('Seeding complete.');
  console.log(JSON.stringify({ processedUsers, processedCards, createdShares, updatedShares }, null, 2));
  process.exit(0);
};

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
