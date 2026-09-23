import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirebaseServices } from '../config/firebase';
import { compressImage } from '../utils/imageCompressor';


/**
 * Simple IndexedDB wrapper for large media files (Audio, Video, Images)
 * to bypass the 5MB localStorage limit and prevent network hanging
 */
const DB_NAME = 'omni_qr_media_db';
const STORE_NAME = 'media_files';

const openMediaDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e);
  });
};

export const saveMediaToIndexedDB = async (id, fileOrData) => {
  try {
    const db = await openMediaDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id, data: fileOrData, timestamp: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(false);
    });
  } catch (err) {
    console.warn('IndexedDB write failed:', err);
    return null;
  }
};

export const getMediaFromIndexedDB = async (id) => {
  try {
    const db = await openMediaDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => reject(null);
    });
  } catch (err) {
    return null;
  }
};

/**
 * Uploads a file with strict timeout to prevent indefinite hanging
 * Falls back immediately to high-performance local storage
 */
export const uploadMediaFile = async (file, folder = 'media', onProgress = null) => {
  if (!file) return null;

  const { isConfigured, storage } = getFirebaseServices();

  // Try Firebase Storage with a strict 3-second timeout guard
  if (isConfigured && storage) {
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storageRef = ref(storage, `omni_qr/${folder}/${Date.now()}_${sanitizedName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            } catch (err) {
              reject(err);
            }
          }
        );
      });

      // Strict 3.5s timeout: if Firebase Storage bucket is disabled, do NOT hang!
      const cloudUrl = await Promise.race([
        uploadPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 3500))
      ]);

      if (cloudUrl) return cloudUrl;
    } catch (err) {
      console.warn('Firebase Storage unavailable, falling back to local media store:', err.message);
    }
  }

  // Fallback: Read file as Data URL / Blob URL with auto-compression for images
  return readFileAsDataURL(file);
};

export const readFileAsDataURL = async (file) => {
  if (file && file.type && file.type.startsWith('image/')) {
    try {
      const compressed = await compressImage(file, 900, 900, 0.82);
      if (compressed) return compressed;
    } catch (e) {
      console.warn('Image compression fallback:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};


