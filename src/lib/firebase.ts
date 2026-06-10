import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase only if we have a real config (placeholder avoidance)
const isConfigured = firebaseConfig.apiKey !== 'YOUR_API_KEY';

export const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const db = isConfigured ? getFirestore(app!, firebaseConfig.firestoreDatabaseId) : null;
export const auth = isConfigured ? getAuth(app!) : null;
