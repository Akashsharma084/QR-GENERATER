/**
 * Cloud Audio Sync for Firebase Spark Plan
 * Allows audio files up to 6MB to be synced directly via Firestore subcollection chunks
 * so uploaded songs stream and play on ANY mobile phone without requiring a paid storage bucket!
 */

import { collection, doc, setDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { getFirebaseServices } from '../config/firebase';

const CHUNK_SIZE = 550 * 1024; // 550KB per chunk to safely stay under Firestore 1MB doc limit

/**
 * Saves uploaded audio file into Firestore subcollection chunks
 */
export const saveAudioChunksToCloud = async (recordId, file) => {
  if (!recordId || !file) return false;

  const { isConfigured, db } = getFirebaseServices();
  if (!isConfigured || !db) return false;

  // Don't chunk if file is excessively large (> 10MB)
  if (file.size > 10 * 1024 * 1024) return false;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const rawBase64 = e.target.result.split(',')[1];
        if (!rawBase64) {
          resolve(false);
          return;
        }

        const totalChunks = Math.ceil(rawBase64.length / CHUNK_SIZE);
        const chunksRef = collection(db, 'omni_qrs', recordId, 'chunks');

        // Write chunks in parallel batches
        const writePromises = [];
        for (let i = 0; i < totalChunks; i++) {
          const slice = rawBase64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          const chunkDoc = doc(chunksRef, String(i).padStart(4, '0'));
          writePromises.push(
            setDoc(chunkDoc, {
              index: i,
              data: slice,
              mimeType: file.type || 'audio/mpeg'
            })
          );
        }

        await Promise.all(writePromises);
        resolve(true);
      } catch (err) {
        console.warn('Failed to upload audio chunks to cloud:', err);
        resolve(false);
      }
    };

    reader.onerror = () => resolve(false);
    reader.readAsDataURL(file);
  });
};

/**
 * Loads audio chunks from Firestore and generates a local Blob URL for mobile audio playback
 */
export const loadAudioChunksFromCloud = async (recordId) => {
  if (!recordId) return null;

  const { isConfigured, db } = getFirebaseServices();
  if (!isConfigured || !db) return null;

  try {
    const chunksRef = collection(db, 'omni_qrs', recordId, 'chunks');
    const q = query(chunksRef, orderBy('index', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    let fullBase64 = '';
    let mimeType = 'audio/mpeg';

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.data) fullBase64 += data.data;
      if (data.mimeType) mimeType = data.mimeType;
    });

    if (!fullBase64) return null;

    // Convert Base64 into a fresh native local Blob on the phone
    const binary = atob(fullBase64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to load audio chunks from cloud:', err);
    return null;
  }
};
