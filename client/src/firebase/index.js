import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAmIDTdg-LALBHLVBYIZq22QuOtu9HRfjI',
  authDomain: 'fledge-a5075.firebaseapp.com',
  projectId: 'fledge-a5075',
  storageBucket: 'fledge-a5075.appspot.com',
  messagingSenderId: '860643914660',
  appId: '1:860643914660:web:6cc71040b86754e2a20731',
  measurementId: 'G-BN1RYGBJD0',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
