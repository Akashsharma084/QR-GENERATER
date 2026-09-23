import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const STORAGE_KEY = 'omni_qr_firebase_config';

export const getStoredFirebaseConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to parse stored Firebase config', e);
  }

  // Check Vite env variables
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }

  return null;
};

export const saveFirebaseConfig = (config) => {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
};

let currentApp = null;
let currentDb = null;
let currentStorage = null;

export const initFirebase = (config = null) => {
  const activeConfig = config || getStoredFirebaseConfig();

  if (!activeConfig || !activeConfig.apiKey || !activeConfig.projectId) {
    currentApp = null;
    currentDb = null;
    currentStorage = null;
    return { isConfigured: false, app: null, db: null, storage: null };
  }

  try {
    if (getApps().length > 0) {
      currentApp = getApp();
    } else {
      currentApp = initializeApp(activeConfig);
    }

    currentDb = getFirestore(currentApp);
    currentStorage = getStorage(currentApp);

    return {
      isConfigured: true,
      app: currentApp,
      db: currentDb,
      storage: currentStorage
    };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return { isConfigured: false, error: err.message };
  }
};

export const getFirebaseServices = () => {
  if (!currentApp) {
    return initFirebase();
  }
  return {
    isConfigured: !!(currentApp && currentDb),
    app: currentApp,
    db: currentDb,
    storage: currentStorage
  };
};
