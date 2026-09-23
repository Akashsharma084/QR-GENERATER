/**
 * Universal Audio Metadata & Smart Album Art Engine
 * 1. Deep Binary ID3 Parser: Extracts embedded APIC / PIC covers (JPEG/PNG) from MP3/M4A
 *    and converts them to persistent Base64 Data URLs so they work across all mobile phones.
 * 2. ID3 Text Extraction: Extracts embedded TIT2 (Title) & TPE1 (Artist) tags directly from file bytes.
 * 3. Multi-Query Apple Music / iTunes Public Catalog Search: If MP3 has no embedded photo
 *    (e.g. YouTube rippers, WhatsApp audio, Indian music sites), cleans clutter and fetches
 *    official 600x600 HD artwork automatically!
 * 4. Smart Dynamic Fallback Cover: Generates a stylish, personalized SVG vinyl cover if no art exists,
 *    ensuring the artwork NEVER stays as the generic placeholder.
 */

import { compressImage } from './imageCompressor';

/**
 * Aggressively cleans song titles and filenames by removing website names, bitrates,
 * track numbers, brackets, and clutter.
 */
export const cleanSongTitle = (str) => {
  if (!str) return '';
  return str
    .replace(/https?:\/\/\S+/gi, '') // URLs
    .replace(/\b[\w-]+\.(com|in|org|net|co|io|cc|is|to|site|club|app|info|xyz|me)\b\s*[-_]?\s*/gi, '') // Domains (y2mate.com, pagalworld.com)
    .replace(/\.[^/.]+$/, '') // file extension
    .replace(/\(.*?\)|\[.*?\]|\{.*?\}/g, '') // (Official Video), [320kbps]
    .replace(/\b\d+\s*k(bps)?\b/gi, '') // 320kbps, 128 kbps
    .replace(/^(\d{1,3}[\s._-]+)+/g, '') // Leading track numbers (01 -, 01. )
    .replace(/[_-]/g, ' ')
    .replace(/\b(mp3|audio|official|lyrics|lyrical|video|song|full|hd|4k|hq|kbps|320|128|download|y2mate|pagalworld|ringtone|remix|slowed|reverb)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Searches Apple Music / iTunes public catalog with multiple intelligent query fallbacks
 */
export const fetchOnlineAlbumArt = async (titleQuery, artistQuery = '') => {
  const cleanTitle = cleanSongTitle(titleQuery);
  const cleanArtist = cleanSongTitle(artistQuery);

  if (!cleanTitle && !cleanArtist) return null;

  // Build ordered query candidates
  const candidates = [];
  if (cleanTitle && cleanArtist) {
    candidates.push(`${cleanTitle} ${cleanArtist}`);
  }
  if (cleanTitle) {
    candidates.push(cleanTitle);
    // If title has a dash (e.g. "Arijit Singh - Kesariya")
    if (cleanTitle.includes('-')) {
      const parts = cleanTitle.split('-').map(p => p.trim()).filter(Boolean);
      if (parts[0]) candidates.push(parts[0]);
      if (parts[1]) candidates.push(parts[1]);
    }
  }
  if (cleanArtist && cleanArtist.length > 2) {
    candidates.push(cleanArtist);
  }

  // De-duplicate candidates
  const uniqueCandidates = [...new Set(candidates.filter(c => c && c.length >= 2))];

  for (const q of uniqueCandidates) {
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=3`;
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Pick best match with artwork
        const match = data.results.find(r => r.artworkUrl100) || data.results[0];
        if (match && match.artworkUrl100) {
          const hdCover = match.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
          return {
            coverUrl: hdCover,
            trackTitle: match.trackName,
            artistName: match.artistName,
            albumName: match.collectionName,
            audioUrl: match.previewUrl || '',
            source: 'catalog',
            queryUsed: q
          };
        }
      }
    } catch (err) {
      console.warn(`Catalog search error for "${q}":`, err.message);
    }
  }

  return null;
};

/**
 * Generates a dynamic SVG cover with vinyl aesthetic and song initials
 */
export const generateSmartCover = (title = 'Music Track', artist = 'Audio') => {
  const initials = (title || 'Track')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] || '')
    .join('')
    .toUpperCase() || '♪';

  const cleanT = (title || 'Music Track').slice(0, 24);
  const cleanA = (artist || 'Audio').slice(0, 20);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4f46e5"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#db2777"/>
      </linearGradient>
      <radialGradient id="vinyl" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#18181b"/>
        <stop offset="70%" stop-color="#09090b"/>
        <stop offset="100%" stop-color="#000000"/>
      </radialGradient>
    </defs>
    <rect width="600" height="600" fill="url(#bg)"/>
    <!-- Vinyl Disc Graphic -->
    <circle cx="300" cy="270" r="170" fill="url(#vinyl)" stroke="#3f3f46" stroke-width="2"/>
    <circle cx="300" cy="270" r="140" fill="none" stroke="#27272a" stroke-width="1.5" stroke-dasharray="4 2"/>
    <circle cx="300" cy="270" r="110" fill="none" stroke="#27272a" stroke-width="1.5"/>
    <circle cx="300" cy="270" r="80" fill="none" stroke="#27272a" stroke-width="1.5" stroke-dasharray="6 3"/>
    <circle cx="300" cy="270" r="55" fill="url(#bg)"/>
    <circle cx="300" cy="270" r="16" fill="#09090b"/>
    <!-- Center text/icon -->
    <text x="300" y="278" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">${initials}</text>
    <!-- Song Info Banner -->
    <rect x="40" y="470" width="520" height="90" rx="16" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.15)"/>
    <text x="300" y="508" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">${cleanT}</text>
    <text x="300" y="538" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="#e4e4e7" text-anchor="middle">${cleanA}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Decodes ID3 text frames with various encodings
 */
const decodeID3Text = (bytes, offset, length) => {
  if (length <= 1) return '';
  const encoding = bytes[offset];
  const slice = bytes.slice(offset + 1, offset + length);
  try {
    if (encoding === 0) return new TextDecoder('iso-8859-1').decode(slice).replace(/\0.*$/g, '').trim();
    if (encoding === 1) return new TextDecoder('utf-16').decode(slice).replace(/\0.*$/g, '').trim();
    if (encoding === 2) return new TextDecoder('utf-16be').decode(slice).replace(/\0.*$/g, '').trim();
    if (encoding === 3) return new TextDecoder('utf-8').decode(slice).replace(/\0.*$/g, '').trim();
  } catch (e) {
    // fallback
  }
  return new TextDecoder().decode(slice).replace(/\0.*$/g, '').trim();
};

/**
 * Extracts embedded album artwork, title, artist from MP3 file bytes
 * Returns persistent Base64 Data URL for coverUrl
 */
export const extractAudioMetadata = async (file) => {
  if (!file) return null;

  return new Promise((resolve) => {
    // Read up to 8MB to capture high-res ID3v2 APIC images
    const slice = file.slice(0, Math.min(file.size, 8 * 1024 * 1024));
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const buffer = e.target.result;
        const bytes = new Uint8Array(buffer);

        let metadata = {
          trackTitle: '',
          artistName: '',
          albumName: '',
          coverUrl: null,
          source: 'embedded'
        };

        // 1. Locate ID3v2 header
        let id3Offset = -1;
        for (let i = 0; i < Math.min(bytes.length - 10, 4096); i++) {
          if (bytes[i] === 0x49 && bytes[i + 1] === 0x44 && bytes[i + 2] === 0x33) { // 'ID3'
            id3Offset = i;
            break;
          }
        }

        if (id3Offset >= 0) {
          const version = bytes[id3Offset + 3]; // 2, 3, or 4
          let cursor = id3Offset + 10;
          const maxScan = Math.min(bytes.length - 10, 8 * 1024 * 1024);

          // Scan frames
          while (cursor < maxScan) {
            // Check for frame ID
            let frameId = '';
            let frameSize = 0;
            let headerSize = 10;

            if (version === 2) {
              // ID3v2.2 uses 3-character frame IDs and 3-byte size
              frameId = String.fromCharCode(bytes[cursor], bytes[cursor + 1], bytes[cursor + 2]);
              frameSize = (bytes[cursor + 3] << 16) | (bytes[cursor + 4] << 8) | bytes[cursor + 5];
              headerSize = 6;
            } else {
              // ID3v2.3 / v2.4 uses 4-character frame IDs
              frameId = String.fromCharCode(bytes[cursor], bytes[cursor + 1], bytes[cursor + 2], bytes[cursor + 3]);
              if (version === 4) {
                // Synchsafe 28-bit
                frameSize = ((bytes[cursor + 4] & 0x7f) << 21) |
                            ((bytes[cursor + 5] & 0x7f) << 14) |
                            ((bytes[cursor + 6] & 0x7f) << 7) |
                            (bytes[cursor + 7] & 0x7f);
              } else {
                // Standard 32-bit big endian
                const view = new DataView(buffer);
                frameSize = view.getUint32(cursor + 4);
              }
            }

            if (!frameId.match(/^[A-Z0-9]{3,4}$/) || frameSize <= 0 || cursor + headerSize + frameSize > bytes.length) {
              break;
            }

            const bodyOffset = cursor + headerSize;

            // Extract Song Title (TIT2 or TT2)
            if ((frameId === 'TIT2' || frameId === 'TT2') && !metadata.trackTitle) {
              metadata.trackTitle = decodeID3Text(bytes, bodyOffset, frameSize);
            }

            // Extract Artist (TPE1 or TP1)
            if ((frameId === 'TPE1' || frameId === 'TP1') && !metadata.artistName) {
              metadata.artistName = decodeID3Text(bytes, bodyOffset, frameSize);
            }

            // Extract Album (TALB or TAL)
            if ((frameId === 'TALB' || frameId === 'TAL') && !metadata.albumName) {
              metadata.albumName = decodeID3Text(bytes, bodyOffset, frameSize);
            }

            // Extract Attached Picture (APIC or PIC)
            if ((frameId === 'APIC' || frameId === 'PIC') && !metadata.coverUrl) {
              // Locate JPEG (FF D8 FF) or PNG (89 50 4E 47)
              let imgStart = -1;
              let mimeType = 'image/jpeg';

              for (let j = bodyOffset; j < Math.min(bodyOffset + 300, bodyOffset + frameSize); j++) {
                if (bytes[j] === 0xff && bytes[j + 1] === 0xd8 && bytes[j + 2] === 0xff) {
                  imgStart = j;
                  mimeType = 'image/jpeg';
                  break;
                }
                if (bytes[j] === 0x89 && bytes[j + 1] === 0x50 && bytes[j + 2] === 0x4e && bytes[j + 3] === 0x47) {
                  imgStart = j;
                  mimeType = 'image/png';
                  break;
                }
              }

              if (imgStart > 0) {
                let imgLength = (bodyOffset + frameSize) - imgStart;

                // For JPEG, find EOI marker (FF D9) to get pristine image boundary
                if (mimeType === 'image/jpeg') {
                  for (let k = bodyOffset + frameSize - 2; k >= imgStart + 2; k--) {
                    if (bytes[k] === 0xff && bytes[k + 1] === 0xd9) {
                      imgLength = (k + 2) - imgStart;
                      break;
                    }
                  }
                }

                if (imgLength > 100) {
                  const imgSlice = bytes.slice(imgStart, imgStart + imgLength);
                  const blob = new Blob([imgSlice], { type: mimeType });
                  // Compress & convert to Base64 Data URL so it is 100% portable
                  const dataUrl = await compressImage(blob, 600, 600, 0.85);
                  metadata.coverUrl = dataUrl;
                }
              }
            }

            cursor += headerSize + frameSize;
          }
        }

        // Direct Fallback Scan for embedded JPEG if APIC frame tag was missed
        if (!metadata.coverUrl) {
          for (let i = 0; i < Math.min(bytes.length - 1000, 2 * 1024 * 1024); i++) {
            // Check for JPEG Start Of Image & App marker (FF D8 FF E0 or FF D8 FF E1)
            if (bytes[i] === 0xff && bytes[i + 1] === 0xd8 && bytes[i + 2] === 0xff && (bytes[i + 3] === 0xe0 || bytes[i + 3] === 0xe1)) {
              // Find JPEG End Of Image (FF D9)
              let eoi = -1;
              for (let j = Math.min(bytes.length - 2, i + 1024 * 1024); j > i + 100; j--) {
                if (bytes[j] === 0xff && bytes[j + 1] === 0xd9) {
                  eoi = j + 2;
                  break;
                }
              }

              if (eoi > i + 1000) {
                const imgSlice = bytes.slice(i, eoi);
                const blob = new Blob([imgSlice], { type: 'image/jpeg' });
                const dataUrl = await compressImage(blob, 600, 600, 0.85);
                metadata.coverUrl = dataUrl;
                break;
              }
            }
          }
        }

        resolve(metadata);
      } catch (err) {
        console.warn('ID3 metadata extraction error:', err);
        resolve(null);
      }
    };

    reader.onerror = () => resolve(null);
    reader.readAsArrayBuffer(slice);
  });
};

// Aliases for backwards compatibility
export const extractAlbumArtFromMp3 = extractAudioMetadata;
