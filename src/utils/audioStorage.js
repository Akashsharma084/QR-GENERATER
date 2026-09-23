/**
 * Audio storage helper using IndexedDB for large audio files
 * Solves the 5MB localStorage quota limit and mobile Safari/Chrome dataURL audio playback issues
 */

const DB_NAME = 'OmniQRAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_blobs';

const openAudioDB = () => {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => resolve(null);
  });
};

/**
 * Stores audio file in IndexedDB and returns a reliable local Blob URL
 */
export const storeAudioBlob = async (id, fileOrBlob) => {
  try {
    const db = await openAudioDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, blob: fileOrBlob, timestamp: Date.now() });
    }
  } catch (err) {
    console.warn('IndexedDB store failed:', err);
  }
  // Return standard Blob URL for instant native audio streaming
  return URL.createObjectURL(fileOrBlob);
};

/**
 * Retrieves audio blob from IndexedDB by ID
 */
export const getAudioBlob = async (id) => {
  try {
    const db = await openAudioDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(URL.createObjectURL(req.result.blob));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
};

/**
 * Converts a base64 Data URL to a Blob URL for iOS Safari and Mobile Chrome compatibility
 */
export const dataUrlToBlobUrl = (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  try {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'audio/mpeg';
    const binary = atob(parts[1]);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to convert dataUrl to Blob:', err);
    return dataUrl;
  }
};
