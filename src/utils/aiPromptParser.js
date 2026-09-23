/**
 * OmniQR Magic AI Semantic Engine
 * Intelligently analyzes natural language prompts in English & Hinglish
 * to extract intent, content fields, design tokens, color moods, and QR geometry.
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

/**
 * Intelligent prompt parser
 */
export const parseAIPrompt = (promptText = '') => {
  const p = promptText.toLowerCase().trim();

  // 1. Detect Content Type
  let detectedType = 'info';

  if (
    p.match(/\b(pay|payment|upi|gpay|phonepe|paytm|rupee|inr|rs\.?|dollar|\$|money|invoice|bill|checkout|crypto|bitcoin)\b/i) ||
    p.includes('paise') || p.includes('dukaan') || p.includes('fees')
  ) {
    detectedType = 'payment';
  } else if (
    p.match(/\b(website|portfolio|web|url|link|site|domain|http)\b/i) ||
    p.includes('.com') || p.includes('.io') || p.includes('.dev')
  ) {
    detectedType = 'info';
  } else if (
    p.match(/\b(music|song|gaana|audio|track|album|spotify|artist|singer|podcast|mp3|sound|beats|lofi)\b/i)
  ) {
    detectedType = 'music';
  } else if (
    p.match(/\b(movie|film|cinema|trailer|teaser|video|youtube video|director|actor|series|episode)\b/i)
  ) {
    detectedType = 'movie';
  } else if (
    p.match(/\b(photo|image|picture|gallery|artwork|wallpaper|pic|camera|photography)\b/i)
  ) {
    detectedType = 'image';
  } else if (
    p.match(/\b(pdf|doc|document|resume|cv|report|brochure|presentation|notes)\b/i)
  ) {
    detectedType = 'document';
  } else if (
    p.match(/\b(wifi|wi-fi|internet|hotspot|password|ssid|vcard|contact|card|phone number|address)\b/i)
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
    // Extract song title (e.g. "Kesariya", "Starboy", song titled X)
    let songName = 'Midnight City Glow';
    let artistName = 'Synthwave Collective';

    const quotesMatch = promptText.match(/["'](.*?)["']/);
    if (quotesMatch) {
      songName = quotesMatch[1];
    } else {
      // Look for common song keywords
      const titleMatch = p.match(/(?:song|track|gaana|music)\s+([a-zA-Z0-9\s]+?)(?=\s+(?:by|from|with|and|in|qr)|$)/i);
      if (titleMatch && titleMatch[1] && titleMatch[1].trim().length > 2 && titleMatch[1].trim() !== 'qr') {
        songName = titleMatch[1].trim();
      } else {
        // Try scanning words before 'song' (e.g. "Kesariya song QR")
        const beforeSong = p.match(/([a-zA-Z0-9]+)\s+song/i);
        if (beforeSong && beforeSong[1]) songName = beforeSong[1];
      }
    }

    const artistMatch = p.match(/(?:by|singer|artist)\s+([a-zA-Z0-9\s]+?)(?=\s+(?:with|and|in|ka|song)|$)/i);
    if (artistMatch && artistMatch[1] && artistMatch[1].trim().length > 2) {
      artistName = artistMatch[1].trim();
    } else {
      const beforeKa = p.match(/([a-zA-Z0-9\s]+?)\s+ka\s+/i);
      if (beforeKa && beforeKa[1]) artistName = beforeKa[1].trim();
    }

    formDataUpdates.trackTitle = songName.replace(/\b\w/g, l => l.toUpperCase());
    formDataUpdates.artistName = artistName.replace(/\b\w/g, l => l.toUpperCase());
    formDataUpdates.audioUrl = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b1/b8/5b/b1b85b3a-dd1f-eb1d-cd23-c6925e3c54aa/mzaf_15073987598519295647.plus.aac.p.m4a';
  } else if (detectedType === 'movie') {
    const quotesMatch = promptText.match(/["'](.*?)["']/);
    const movieMatch = p.match(/(?:movie|film)\s+([a-zA-Z0-9\s]+?)(?=\s+(?:by|directed|with|and|in|qr)|$)/i);
    const movieTitle = quotesMatch ? quotesMatch[1] : (movieMatch ? movieMatch[1].trim() : 'Cyberpunk Chronicles');

    formDataUpdates.movieTitle = movieTitle.replace(/\b\w/g, l => l.toUpperCase());
    formDataUpdates.movieGenre = p.includes('sci-fi') || p.includes('futuristic') ? 'Sci-Fi / Action' : 'Drama / Thriller';
    formDataUpdates.director = 'Visionary Studios';
    formDataUpdates.ratingYear = '8.9/10 • 2026';
    formDataUpdates.synopsis = 'An epic visual journey exploring future technology and the edge of humanity.';
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
    summary: `Configured ${detectedType.toUpperCase()} QR with ${chosenPalette.dotColor} aesthetics based on your prompt.`
  };
};
