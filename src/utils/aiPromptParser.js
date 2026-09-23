/**
 * OmniQR Magic AI Semantic Engine
 * Intelligently analyzes natural language prompts in English & Hinglish
 * to extract intent, content fields, design tokens, color moods, and QR geometry.
 * Connects to live iTunes Apple Music API and Pollinations AI for real songs & images.
 */

// Available QR styling presets
const STYLE_PALETTES = {
  emerald: {
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#10b981',
    cornerSquareColor: '#10b981',
    cornerDotColor: '#06b6d4',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#10b981' },
        { offset: 100, color: '#06b6d4' }
      ]
    },
    frame: {
      style: 'banner-bottom',
      text: 'SCAN TO PAY',
      color: '#10b981',
      textColor: '#ffffff'
    }
  },
  neonPurple: {
    dotType: 'dots',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#a855f7',
    cornerSquareColor: '#c084fc',
    cornerDotColor: '#ec4899',
    gradient: {
      type: 'linear',
      rotation: 135,
      colorStops: [
        { offset: 0, color: '#a855f7' },
        { offset: 100, color: '#ec4899' }
      ]
    },
    frame: {
      style: 'banner-bottom',
      text: 'FOLLOW ME',
      color: '#a855f7',
      textColor: '#ffffff'
    }
  },
  cyberCyan: {
    dotType: 'classy',
    cornerSquareType: 'classy',
    cornerDotType: 'square',
    dotColor: '#06b6d4',
    cornerSquareColor: '#0ea5e9',
    cornerDotColor: '#3b82f6',
    gradient: {
      type: 'linear',
      rotation: 90,
      colorStops: [
        { offset: 0, color: '#06b6d4' },
        { offset: 100, color: '#3b82f6' }
      ]
    },
    frame: {
      style: 'card',
      text: 'SCAN HERE',
      color: '#06b6d4',
      textColor: '#0f172a'
    }
  },
  crimsonCinema: {
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#e11d48',
    cornerSquareColor: '#f43f5e',
    cornerDotColor: '#fb7185',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#e11d48' },
        { offset: 100, color: '#fb923c' }
      ]
    },
    frame: {
      style: 'banner-bottom',
      text: 'SCAN TO WATCH',
      color: '#e11d48',
      textColor: '#ffffff'
    }
  },
  amberGold: {
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#f59e0b',
    cornerSquareColor: '#fbbf24',
    cornerDotColor: '#d97706',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#f59e0b' },
        { offset: 100, color: '#ef4444' }
      ]
    },
    frame: {
      style: 'banner-bottom',
      text: 'VIP ACCESS',
      color: '#f59e0b',
      textColor: '#000000'
    }
  },
  darkVelvet: {
    dotType: 'extra-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#6366f1',
    cornerSquareColor: '#818cf8',
    cornerDotColor: '#a855f7',
    gradient: {
      type: 'linear',
      rotation: 120,
      colorStops: [
        { offset: 0, color: '#6366f1' },
        { offset: 100, color: '#a855f7' }
      ]
    },
    frame: {
      style: 'banner-bottom',
      text: 'SCAN TO LISTEN',
      color: '#6366f1',
      textColor: '#ffffff'
    }
  }
};

// Instant high-speed backup tracks for top artists (0ms latency fallback)
const KNOWN_ARTIST_PRESETS = {
  'honey singh': {
    trackTitle: 'Brown Rang',
    artistName: 'Yo Yo Honey Singh',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/78/de/f5/78def50a-3ee9-8c97-fb22-8a4822a429c0/mzaf_17810852639272569375.plus.aac.p.m4a',
    audioName: 'Brown Rang - Yo Yo Honey Singh.m4a',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/69/1a/1e/691a1ec2-cae5-4923-4a43-72b1155c004f/8902633269552.jpg/600x600bb.jpg',
    lyrics: 'Kudiye ni tere brown rang ne...\nMunde patt te ni saare mere town de!\nArtist: Yo Yo Honey Singh • International Villager'
  },
  'arijit': {
    trackTitle: 'Kesariya',
    artistName: 'Arijit Singh & Pritam',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/44/7f/7e/447f7ed6-4903-a20c-c6f3-e380f7ad2267/mzaf_13508169229046645391.plus.aac.p.m4a',
    audioName: 'Kesariya - Arijit Singh.m4a',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ef/10/7c/ef107c13-a4c3-e818-a621-c4c01f652bbf/190296377854.jpg/600x600bb.jpg',
    lyrics: 'Kesariya tera ishq hai piya...\nRang jaaun jo main haath lagaun\nArtist: Arijit Singh • Brahmastra'
  },
  'diljit': {
    trackTitle: 'Born to Shine',
    artistName: 'Diljit Dosanjh',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/20/d1/2b/20d12b04-f58c-bb0e-17cf-643f8e5b6ad6/mzaf_14959141753733052601.plus.aac.p.m4a',
    audioName: 'Born to Shine - Diljit Dosanjh.m4a',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cb/2a/39/cb2a3962-cf17-bf4d-b6a1-94cb3229b4df/195497063683.jpg/600x600bb.jpg',
    lyrics: 'Hateran de dilon darr kaddna...\nKade kisse de shareer vich vadhna na\nArtist: Diljit Dosanjh • G.O.A.T.'
  },
  'badshah': {
    trackTitle: 'Genda Phool',
    artistName: 'Badshah & Payal Dev',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c3/14/ec/c314ecae-377a-2d64-e129-d6e2e5055b8e/mzaf_11303867664654924192.plus.aac.p.m4a',
    audioName: 'Genda Phool - Badshah.m4a',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/80/f7/e4/80f7e4f9-2c7b-b892-04e3-3f145ca09c85/886448378887.jpg/600x600bb.jpg',
    lyrics: 'Boroloker biti lo, lomba lomba chul...\nArtist: Badshah & Payal Dev'
  }
};

/**
 * Live Apple Music / iTunes Public Search API
 * Fetches REAL song preview audio and real HD album artwork with word boundary matching
 */
const fetchRealMusic = async (searchQuery) => {
  const qLower = searchQuery.toLowerCase();

  // 1. Check known artists table for immediate match
  let knownFallback = null;
  for (const [key, preset] of Object.entries(KNOWN_ARTIST_PRESETS)) {
    if (qLower.includes(key)) {
      knownFallback = preset;
      break;
    }
  }

  try {
    // Clean query using \b word boundaries so "desi kalakaar", "dope shope", "kesariya" are NEVER mangled!
    const clean = searchQuery
      .replace(/\b(?:song|songs|gaana|gaane|gana|gane|geet|music|track|audio|ka|ke|ki|ko|se|me|liye|qr|code|banao|chahiye|de|do|give|make|create|play|sunao|chalao|generate|please)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const searchTerm = clean || (knownFallback ? knownFallback.artistName : 'Honey Singh');

    // Attempt 1: Search Indian iTunes Store
    let res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&country=IN&limit=3`);
    let data = res.ok ? await res.json() : null;

    // Attempt 2: If no result, search Global iTunes Store
    if (!data || !data.results || data.results.length === 0) {
      res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=3`);
      data = res.ok ? await res.json() : null;
    }

    if (data && data.results && data.results.length > 0) {
      // Find item with valid preview audio
      const item = data.results.find(r => r.previewUrl) || data.results[0];
      if (item && item.trackName) {
        return {
          trackTitle: item.trackName,
          artistName: item.artistName,
          audioUrl: item.previewUrl || (knownFallback ? knownFallback.audioUrl : ''),
          audioName: `${item.trackName} - ${item.artistName}.m4a`,
          albumCover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : (knownFallback ? knownFallback.albumCover : ''),
          lyrics: `Now playing: ${item.trackName}\nArtist: ${item.artistName}\nAlbum: ${item.collectionName || 'Single'}`
        };
      }
    }
  } catch (err) {
    console.warn('Live music search error, using smart fallback:', err);
  }

  // If live search had zero results or error, return the known artist preset or default
  return knownFallback || KNOWN_ARTIST_PRESETS['honey singh'];
};

/**
 * Intelligent prompt parser (Async with Live API integration)
 */
export const parseAIPrompt = async (promptText = '') => {
  const p = promptText.toLowerCase().trim();

  // 1. Detect Content Type
  let detectedType = 'info';

  if (
    p.match(/\b(pay|payment|upi|gpay|phonepe|paytm|rupee|inr|rs\.?|dollar|\$|money|invoice|bill|checkout|crypto|bitcoin)\b/i) ||
    p.includes('paise') || p.includes('dukaan') || p.includes('fees')
  ) {
    detectedType = 'payment';
  } else if (
    p.match(/\b(music|song|songs|gaana|gaane|gana|gane|geet|audio|track|album|spotify|artist|singer|podcast|mp3|sound|beats|lofi)\b/i) ||
    p.includes('honey singh') || p.includes('yo yo') || p.includes('arijit') || p.includes('diljit') || p.includes('badshah') || p.includes('sidhu') || p.includes('karan aujla') || p.includes('shreya') || p.includes('neha kakkar')
  ) {
    detectedType = 'music';
  } else if (
    p.match(/\b(photo|image|picture|gallery|artwork|wallpaper|pic|camera|photography|portrait|drawing|art)\b/i) ||
    p.includes('photo') || p.includes('image')
  ) {
    detectedType = 'image';
  } else if (
    p.match(/\b(movie|film|cinema|trailer|teaser|video|youtube video|director|actor|series|episode|clip)\b/i)
  ) {
    detectedType = 'movie';
  } else if (
    p.match(/\b(pdf|doc|document|resume|cv|report|brochure|presentation|notes)\b/i)
  ) {
    detectedType = 'document';
  } else if (
    p.match(/\b(wifi|wi-fi|internet|hotspot|password|ssid|vcard|contact|card|phone number|address)\b/i)
  ) {
    detectedType = 'info';
  } else if (
    p.match(/\b(website|portfolio|web|url|link|site|domain|http)\b/i) ||
    p.includes('.com') || p.includes('.io') || p.includes('.dev')
  ) {
    detectedType = 'info';
  }

  // 2. Select Style Palette
  let chosenPalette = STYLE_PALETTES.cyberCyan;
  if (p.includes('green') || p.includes('emerald') || detectedType === 'payment') {
    chosenPalette = STYLE_PALETTES.emerald;
  } else if (p.includes('purple') || p.includes('pink') || p.includes('neon')) {
    chosenPalette = STYLE_PALETTES.neonPurple;
  } else if (p.includes('red') || p.includes('crimson') || p.includes('cinema') || detectedType === 'movie') {
    chosenPalette = STYLE_PALETTES.crimsonCinema;
  } else if (p.includes('gold') || p.includes('yellow') || p.includes('amber')) {
    chosenPalette = STYLE_PALETTES.amberGold;
  } else if (detectedType === 'music' || p.includes('lofi') || p.includes('dark')) {
    chosenPalette = STYLE_PALETTES.darkVelvet;
  }

  // 3. Extract Specific Fields based on Type
  const formDataUpdates = {};

  if (detectedType === 'payment') {
    // Extract Amount (e.g. ₹150, 150 rs, $50, 500)
    const amountMatch = p.match(/(?:(?:rs\.?|inr|₹|\$)\s*(\d+(?:\.\d{1,2})?)|(\d+(?:\.\d{1,2})?)\s*(?:rs|rupees|inr|dollars?|\$))/i);
    const genericNumMatch = p.match(/\b\d{2,6}\b/);
    if (amountMatch) {
      formDataUpdates.amount = amountMatch[1] || amountMatch[2];
    } else if (genericNumMatch) {
      formDataUpdates.amount = genericNumMatch[0];
    } else {
      formDataUpdates.amount = '150';
    }

    // Extract Payee / Business Name
    let payee = 'Omni Store';
    if (p.includes('coffee') || p.includes('cafe')) payee = 'Coffee Lounge';
    else if (p.includes('restaurant') || p.includes('dhaba') || p.includes('food')) payee = 'Food Corner';
    else if (p.includes('store') || p.includes('shop') || p.includes('dukaan')) payee = 'Retail Store';
    else {
      const forMatch = p.match(/(?:for|shop|store|cafe|restaurant|name)\s+([a-zA-Z0-9\s]+?)(?=\s+(?:ke liye|with|and|having|₹|\$|theme|mode|in|qr)|$)/i);
      if (forMatch && forMatch[1] && forMatch[1].length < 25 && !forMatch[1].includes('ke liye')) {
        payee = forMatch[1].trim();
      }
    }
    formDataUpdates.payeeName = payee.replace(/\b\w/g, l => l.toUpperCase());
    formDataUpdates.paymentNote = `${formDataUpdates.payeeName} Payment`;

    // Extract UPI ID if mentioned
    const upiMatch = p.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9]+/);
    if (upiMatch) {
      formDataUpdates.upiId = upiMatch[0];
    } else {
      const slug = payee.toLowerCase().replace(/[^a-z0-9]/g, '');
      formDataUpdates.upiId = `${slug || 'omnistore'}@okhdfcbank`;
    }
    formDataUpdates.paymentMode = 'direct';
  } else if (detectedType === 'music') {
    // REAL LIVE MUSIC LOOKUP via Apple Music API
    const liveMusicResult = await fetchRealMusic(promptText);

    if (liveMusicResult) {
      formDataUpdates.trackTitle = liveMusicResult.trackTitle;
      formDataUpdates.artistName = liveMusicResult.artistName;
      formDataUpdates.audioUrl = liveMusicResult.audioUrl;
      formDataUpdates.audioName = liveMusicResult.audioName || `${liveMusicResult.trackTitle}.m4a`;
      formDataUpdates.albumCover = liveMusicResult.albumCover;
      formDataUpdates.lyrics = liveMusicResult.lyrics;
    }
  } else if (detectedType === 'image') {
    // REAL DYNAMIC IMAGE GENERATION via Pollinations AI
    const cleanImgQuery = promptText
      .replace(/\b(?:image|photo|picture|pic|wallpaper|gallery|ka|ke|ki|ko|se|me|liye|qr|code|banao|chahiye|de|do|give|make|create|hai|dikhao)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'futuristic artwork';

    const title = cleanImgQuery.replace(/\b\w/g, l => l.toUpperCase());
    formDataUpdates.imageTitle = title;
    formDataUpdates.imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanImgQuery)}?width=1000&height=750&nologo=true`;
    formDataUpdates.photographer = 'Omni Robo AI Studio';
    formDataUpdates.imageCaption = `AI visual generated for: ${title}`;
  } else if (detectedType === 'movie') {
    const cleanMovieQuery = promptText
      .replace(/\b(?:movie|film|trailer|teaser|cinema|video|ka|ke|ki|ko|se|me|liye|qr|code|banao|chahiye|de|do)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'Cyberpunk Chronicles';

    const movieTitle = cleanMovieQuery.replace(/\b\w/g, l => l.toUpperCase());
    formDataUpdates.movieTitle = movieTitle;
    formDataUpdates.movieGenre = p.includes('sci-fi') || p.includes('futuristic') ? 'Sci-Fi / Action' : 'Action / Drama';
    formDataUpdates.director = 'Visionary Studios';
    formDataUpdates.ratingYear = '8.9/10 • 2026';
    formDataUpdates.moviePoster = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanMovieQuery + ' movie official cinematic poster') }?width=800&height=1100&nologo=true`;
    formDataUpdates.synopsis = `An epic cinema showcase for ${movieTitle}. Experience the full trailer, high-res posters, and story breakdown.`;
  } else if (detectedType === 'info') {
    // Check if WiFi
    if (p.includes('wifi') || p.includes('wi-fi') || p.includes('hotspot') || p.includes('internet')) {
      formDataUpdates.infoType = 'wifi';
      const ssidMatch = p.match(/(?:network|ssid|name)\s+([a-zA-Z0-9_-]+)/i);
      const passMatch = p.match(/(?:password|pass|key)\s+([a-zA-Z0-9@#$_-]+)/i);
      formDataUpdates.wifiSsid = ssidMatch ? ssidMatch[1] : 'OmniStudio_HighSpeed_5G';
      formDataUpdates.wifiPassword = passMatch ? passMatch[1] : 'Password2026';
      formDataUpdates.wifiEncryption = 'WPA';
    } else {
      formDataUpdates.infoType = 'vcard';
      formDataUpdates.firstName = 'Sarah';
      formDataUpdates.lastName = 'Connor';
      formDataUpdates.jobTitle = 'Creative Director';
      formDataUpdates.organization = 'Studio Innovations';
    }
  }

  // 4. Center Logo detection
  let logoPreset = null;
  if (detectedType === 'payment') logoPreset = 'currency';
  else if (detectedType === 'music') logoPreset = 'music';
  else if (detectedType === 'movie') logoPreset = 'movie';
  else if (detectedType === 'image') logoPreset = 'camera';
  else if (detectedType === 'info' && formDataUpdates.infoType === 'wifi') logoPreset = 'wifi';
  else if (detectedType === 'info') logoPreset = 'link';

  const customConfig = {
    ...chosenPalette,
    logoPreset: logoPreset || chosenPalette.logoPreset
  };

  return {
    contentType: detectedType,
    formData: formDataUpdates,
    customConfig,
    summary: `Configured ${detectedType.toUpperCase()} QR with live data and ${chosenPalette.dotColor} aesthetics.`
  };
};
