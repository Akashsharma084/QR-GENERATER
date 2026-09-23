import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc 
} from 'firebase/firestore';
import { getFirebaseServices } from '../config/firebase';

const LOCAL_VAULT_KEY = 'omni_qr_vault_records';

const getLocalRecords = () => {
  try {
    const raw = localStorage.getItem(LOCAL_VAULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local vault', e);
    return [];
  }
};

const saveLocalRecords = (records) => {
  try {
    localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('LocalStorage quota limit reached, saving trimmed records:', e.message);
    try {
      // Keep recent 8 records to prevent quota error with large audio/media
      localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(records.slice(0, 8)));
    } catch (e2) {
      console.warn('Cannot persist all records to localStorage due to size');
    }
  }
};

// Fast timeout helper to prevent hanging if Firestore API is uninitialized
const withTimeout = (promise, ms = 2000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), ms))
  ]);
};

/**
 * Save a new QR Code record
 */
export const saveQRRecord = async (record) => {
  const finalRecord = {
    ...record,
    createdAt: record.createdAt || new Date().toISOString(),
    scanCount: record.scanCount || 0
  };

  // 1. Instantly save to local cache (0ms latency)
  const localList = getLocalRecords();
  const existingIndex = localList.findIndex(r => r.id === finalRecord.id);
  if (existingIndex >= 0) {
    localList[existingIndex] = finalRecord;
  } else {
    localList.unshift(finalRecord);
  }
  saveLocalRecords(localList);

  // 2. Sync to Firestore in background without hanging the UI
  const { isConfigured, db } = getFirebaseServices();
  if (isConfigured && db) {
    try {
      const qrDocRef = doc(db, 'omni_qrs', finalRecord.id);
      await withTimeout(setDoc(qrDocRef, finalRecord, { merge: true }), 2500);
    } catch (err) {
      console.warn('Firestore sync skipped or timed out, saved locally:', err.message);
    }
  }

  return finalRecord;
};

/**
 * Retrieve a QR record by its unique ID (Instant Cache-First)
 */
export const getQRRecordById = async (id) => {
  // 1. Check local storage first - If found, return instantly (0ms)!
  const localList = getLocalRecords();
  const localFound = localList.find(r => r.id === id);

  if (localFound) {
    return localFound;
  }

  // 2. If not in local storage (e.g. scanned from a phone), fetch from Firestore
  const { isConfigured, db } = getFirebaseServices();
  if (isConfigured && db) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const docRef = doc(db, 'omni_qrs', id);
        const snapshot = await withTimeout(getDoc(docRef), 5000);
        if (snapshot && snapshot.exists()) {
          const firestoreData = { id: snapshot.id, ...snapshot.data() };
          localList.unshift(firestoreData);
          saveLocalRecords(localList);
          return firestoreData;
        }
      } catch (err) {
        console.warn(`Firestore fetch attempt ${attempt + 1} issue:`, err.message);
      }
      // If first attempt missed (e.g. network latency right after creation), wait briefly and retry
      if (attempt === 0) {
        await new Promise(r => setTimeout(r, 600));
      }
    }
  }

  return null;
};

/**
 * Increment scan/view count for a QR record
 */
export const incrementScanCount = async (id) => {
  const localList = getLocalRecords();
  const item = localList.find(r => r.id === id);
  if (item) {
    item.scanCount = (item.scanCount || 0) + 1;
    saveLocalRecords(localList);
  }

  const { isConfigured, db } = getFirebaseServices();
  if (isConfigured && db) {
    try {
      const docRef = doc(db, 'omni_qrs', id);
      withTimeout(updateDoc(docRef, { scanCount: increment(1) }), 2000).catch(() => {});
    } catch (err) {
      // background update
    }
  }
};

/**
 * Get all saved QR records
 */
export const getAllQRRecords = async () => {
  const localList = getLocalRecords();

  const { isConfigured, db } = getFirebaseServices();
  if (isConfigured && db) {
    try {
      const q = query(collection(db, 'omni_qrs'), orderBy('createdAt', 'desc'));
      const snapshot = await withTimeout(getDocs(q), 3000);
      const cloudRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const mergedMap = new Map();
      cloudRecords.forEach(r => mergedMap.set(r.id, r));
      localList.forEach(r => {
        if (!mergedMap.has(r.id)) mergedMap.set(r.id, r);
      });

      const mergedList = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      saveLocalRecords(mergedList);
      return mergedList;
    } catch (err) {
      console.warn('Failed to fetch from Firestore, returning local:', err.message);
    }
  }

  return localList;
};

/**
 * Delete a QR record
 */
export const deleteQRRecord = async (id) => {
  const localList = getLocalRecords().filter(r => r.id !== id);
  saveLocalRecords(localList);

  const { isConfigured, db } = getFirebaseServices();
  if (isConfigured && db) {
    try {
      await withTimeout(deleteDoc(doc(db, 'omni_qrs', id)), 2000);
    } catch (err) {
      console.warn('Failed to delete on Firestore:', err.message);
    }
  }
};
