/**
 * Universal Media Storage helper using IndexedDB for Audio & Video files
 * Eliminates localStorage quota errors and enables native hardware streaming for MP4, WebM, MP3, WAV
 */

const DB_NAME = 'OmniQRMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

const openMediaDB = () => {
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
 * Stores audio or video file in IndexedDB and returns a reliable local Blob URL
 */
export const storeMediaBlob = async (id, fileOrBlob) => {
  try {
    const db = await openMediaDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, blob: fileOrBlob, timestamp: Date.now() });
    }
  } catch (err) {
    console.warn('IndexedDB write failed:', err);
  }
  return URL.createObjectURL(fileOrBlob);
};

/**
 * Retrieves media blob from IndexedDB by ID
 */
export const getMediaBlob = async (id) => {
  try {
    const db = await openMediaDB();
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
export const mediaDataUrlToBlobUrl = (dataUrl) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  try {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
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
