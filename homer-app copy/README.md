# Homer App (React + Vite)

Custom NFC memory-sharing experience built with React 19, Vite, MUI, and OpenAI/Firebase integrations.

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and populate the following keys (all prefixed with `VITE_` so Vite exposes them to the client):

| Key | Purpose |
| --- | --- |
| `VITE_OPENAI_API_KEY` | Powers the in-app Homer AI assistant. |
| `VITE_FIREBASE_API_KEY` + related Firebase keys | Initialize Firebase App + Analytics (`src/lib/firebase.js`). |

Never commit your real `.env`; it is already git-ignored. Rotate keys if they were ever exposed.

## Firebase

- Firebase is initialized once in `src/lib/firebase.js` using the modular SDK.
- Analytics is loaded conditionally to avoid SSR/build issues; extend this module if you add Firestore/Storage.
- Authentication helpers live in `src/lib/firebaseAuth.js`, and a React provider in `src/context/AuthContext.jsx` exposes `user`, `signIn`, and `signOut` to the UI (see `Profile` page for usage).

## OpenAI

`ChatInterface` expects `VITE_OPENAI_API_KEY`. For production deploys, consider proxying requests through a backend to keep keys server-side.
