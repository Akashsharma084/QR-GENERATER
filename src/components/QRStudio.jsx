import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, Film, Music, Image as ImageIcon, FileText, UserPlus, 
  Sparkles, Layers, Sliders, RefreshCw, QrCode, Wand2 
} from 'lucide-react';
import { PaymentForm } from './forms/PaymentForm';
import { MovieForm } from './forms/MovieForm';
import { MusicForm } from './forms/MusicForm';
import { ImageForm } from './forms/ImageForm';
import { DocumentForm } from './forms/DocumentForm';
import { InfoForm } from './forms/InfoForm';
import { AIStudioPrompt } from './ai/AIStudioPrompt';
import { CustomizerPanel } from './CustomizerPanel';
import { QRPreview } from './QRPreview';
import { generatePaymentURI } from '../utils/paymentHelper';
import { generateVCard, generateWiFi } from '../utils/vcardHelper';
import { saveQRRecord } from '../services/qrDataService';
import { PRESET_ICONS } from '../utils/presetIcons';

const DEFAULT_PRESETS_BY_TYPE = {
  payment: {
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
        { offset: 1, color: '#06b6d4' }
      ]
    },
    frameLabel: 'SCAN TO PAY',
    selectedPresetIcon: 'pay',
    logo: PRESET_ICONS.find(i => i.id === 'pay')?.iconUrl || ''
  },
  movie: {
    dotType: 'classy',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#f43f5e',
    cornerSquareColor: '#f43f5e',
    cornerDotColor: '#a855f7',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#f43f5e' },
        { offset: 1, color: '#a855f7' }
      ]
    },
    frameLabel: 'SCAN TO WATCH',
    selectedPresetIcon: 'movie',
    logo: PRESET_ICONS.find(i => i.id === 'movie')?.iconUrl || ''
  },
  music: {
    dotType: 'dots',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#8b5cf6',
    cornerSquareColor: '#8b5cf6',
    cornerDotColor: '#ec4899',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#8b5cf6' },
        { offset: 1, color: '#ec4899' }
      ]
    },
    frameLabel: 'SCAN TO LISTEN',
    selectedPresetIcon: 'music',
    logo: PRESET_ICONS.find(i => i.id === 'music')?.iconUrl || ''
  },
  image: {
    dotType: 'extra-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#0ea5e9',
    cornerSquareColor: '#0ea5e9',
    cornerDotColor: '#6366f1',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#0ea5e9' },
        { offset: 1, color: '#6366f1' }
      ]
    },
    frameLabel: 'SCAN FOR PHOTO',
    selectedPresetIcon: 'image',
    logo: PRESET_ICONS.find(i => i.id === 'image')?.iconUrl || ''
  },
  document: {
    dotType: 'classy-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'square',
    dotColor: '#f59e0b',
    cornerSquareColor: '#f59e0b',
    cornerDotColor: '#ef4444',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#f59e0b' },
        { offset: 1, color: '#ef4444' }
      ]
    },
    frameLabel: 'SCAN FOR DOC',
    selectedPresetIcon: 'doc',
    logo: PRESET_ICONS.find(i => i.id === 'doc')?.iconUrl || ''
  },
  info: {
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    dotColor: '#6366f1',
    cornerSquareColor: '#6366f1',
    cornerDotColor: '#a855f7',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#6366f1' },
        { offset: 1, color: '#a855f7' }
      ]
    },
    frameLabel: 'SCAN TO CONNECT',
    selectedPresetIcon: 'link',
    logo: PRESET_ICONS.find(i => i.id === 'link')?.iconUrl || ''
  }
};

export const QRStudio = ({ onSavedSuccess }) => {
  const [contentType, setContentType] = useState('payment');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [recordId, setRecordId] = useState(() => 'omni_' + Math.random().toString(36).substring(2, 9));

  // Form State
  const [formData, setFormData] = useState({
    // Payment Defaults
    paymentMode: 'direct', // 'direct' for GPay/PhonePe scanner, 'landing' for web page
    paymentMethod: 'upi',
    payeeName: 'Alex Coffee & Roastery',
    upiId: 'alexcoffee@okaxis',
    currency: 'INR',
    amount: '150',
    paymentNote: 'Cold Brew & Croissant',
    // Movie Defaults
    movieTitle: 'Interstellar: The Journey',
    movieGenre: 'Sci-Fi / Adventure',
    moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    videoType: 'youtube',
    director: 'Christopher Nolan',
    ratingYear: '8.7/10 • 2014',
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    // Music Defaults
    trackTitle: 'Midnight City Glow',
    artistName: 'Synthwave Collective',
    albumCover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b1/b8/5b/b1b85b3a-dd1f-eb1d-cd23-c6925e3c54aa/mzaf_15073987598519295647.plus.aac.p.m4a',
    lyrics: 'Neon lights reflecting on the wet pavement...\nDriving through the electric night.',
    // Image Defaults
    imageTitle: 'Ethereal Aurora Borealis',
    photographer: 'Elena Rostova',
    imageUrl: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'Captured under freezing arctic skies in Tromsø, Norway.',
    // Document Defaults
    docTitle: 'Company Annual Report 2026',
    docAuthor: 'Strategy & Innovation Team',
    docUrl: '',
    docDesc: 'Key milestones, growth metrics, and quarterly performance breakdown.',
    // Info Defaults
    infoType: 'vcard',
    firstName: 'Sarah',
    lastName: 'Connor',
    phone: '+1 (555) 349-2041',
    email: 'sarah.connor@skyline.io',
    organization: 'Skyline Technologies',
    jobTitle: 'VP of Product',
    website: 'https://skyline.io',
    wifiSsid: 'OmniStudio_HighSpeed_5G',
    wifiPassword: 'SuperSecretPassword2026',
    wifiEncryption: 'WPA',
    textContent: 'Welcome to our studio! Feel free to grab a coffee and make yourself comfortable.',
    textTitle: 'Studio Guest Guide',
    urlLink: 'https://antigravity.google'
  });

  // Customizer styling state
  const [customConfig, setCustomConfig] = useState(DEFAULT_PRESETS_BY_TYPE.payment);

  // Switch type and apply recommended preset styles
  const handleTypeChange = (newType) => {
    setContentType(newType);
    if (DEFAULT_PRESETS_BY_TYPE[newType]) {
      setCustomConfig(DEFAULT_PRESETS_BY_TYPE[newType]);
    }
  };

  // Generate dynamic viewer URL
  const viewerUrl = useMemo(() => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}#view/${recordId}`;
  }, [recordId]);

  // Derive QR Data string:
  // For Payment with Direct mode, encode upi://pay directly so GPay/PhonePe camera scanner opens payment instantly!
  // For other modes or rich media, encode viewerUrl for the full interactive receiver page.
  const qrDataString = useMemo(() => {
    if (contentType === 'payment' && formData.paymentMode === 'direct') {
      const uri = generatePaymentURI(formData);
      return uri || viewerUrl;
    }
    return viewerUrl;
  }, [contentType, formData, viewerUrl]);

  // Title for display
  const displayTitle = useMemo(() => {
    switch (contentType) {
      case 'payment':
        return `${formData.payeeName || 'Payment'} (${formData.currency || 'INR'} ${formData.amount || ''})`.trim();
      case 'movie':
        return formData.movieTitle || 'Movie Showcase';
      case 'music':
        return `${formData.trackTitle || 'Track'} - ${formData.artistName || 'Artist'}`;
      case 'image':
        return formData.imageTitle || 'Photo Gallery';
      case 'document':
        return formData.docTitle || 'Document';
      case 'info':
        return formData.infoType === 'vcard' ? `${formData.firstName} ${formData.lastName}` :
               formData.infoType === 'wifi' ? `WiFi: ${formData.wifiSsid}` :
               formData.infoType === 'text' ? (formData.textTitle || 'Note') :
               (formData.urlLink || 'Web Link');
      default:
        return 'OmniQR Code';
    }
  }, [contentType, formData]);

  const handleApplyAIGeneration = (aiResult) => {
    if (!aiResult) return;
    if (aiResult.contentType) {
      setContentType(aiResult.contentType);
    }
    if (aiResult.formData) {
      setFormData(prev => ({
        ...prev,
        ...aiResult.formData
      }));
    }
    if (aiResult.customConfig) {
      setCustomConfig(prev => ({
        ...prev,
        ...aiResult.customConfig
      }));
    }
  };

  // Auto-sync current record to Firestore & Local cache in real-time
  // so scanning directly off the screen ALWAYS finds the content!
  useEffect(() => {
    const timer = setTimeout(() => {
      const record = {
        id: recordId,
        type: contentType,
        title: displayTitle,
        content: { ...formData },
        customConfig: { ...customConfig }
      };
      saveQRRecord(record).catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, [recordId, contentType, displayTitle, formData, customConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const record = {
        id: recordId,
        type: contentType,
        title: displayTitle,
        content: { ...formData },
        customConfig: { ...customConfig }
      };

      await saveQRRecord(record);
      if (onSavedSuccess) {
        onSavedSuccess(record);
      }
    } catch (err) {
      console.error('Failed to save record:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="studio-grid">
      {/* Left Column: Form & Customizer */}
      <div className="glass-panel">
        {/* Top Header Row with Category Label & AI Mode Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Choose Category:</span>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsAIOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              color: '#f0abfc',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.25)'
            }}
          >
            <Sparkles size={14} style={{ color: '#ec4899' }} />
            <span>✨ Magic AI Prompt Mode</span>
          </button>
        </div>

        {/* Content Type Pill Bar */}
        <div className="content-type-selector">
          {[
            { id: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
            { id: 'movie', label: 'Movie & Video', icon: <Film size={16} /> },
            { id: 'music', label: 'Music & Audio', icon: <Music size={16} /> },
            { id: 'image', label: 'Photo & Art', icon: <ImageIcon size={16} /> },
            { id: 'document', label: 'Document', icon: <FileText size={16} /> },
            { id: 'info', label: 'Info & vCard', icon: <UserPlus size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`type-pill ${tab.id} ${contentType === tab.id ? 'active' : ''}`}
              onClick={() => handleTypeChange(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div>
          {contentType === 'payment' && (
            <PaymentForm formData={formData} setFormData={setFormData} />
          )}

          {contentType === 'movie' && (
            <MovieForm
              formData={formData}
              setFormData={setFormData}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          )}

          {contentType === 'music' && (
            <MusicForm
              formData={formData}
              setFormData={setFormData}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              recordId={recordId}
            />
          )}

          {contentType === 'image' && (
            <ImageForm
              formData={formData}
              setFormData={setFormData}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          )}

          {contentType === 'document' && (
            <DocumentForm
              formData={formData}
              setFormData={setFormData}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          )}

          {contentType === 'info' && (
            <InfoForm formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Visual Customization Studio */}
        <CustomizerPanel
          customConfig={customConfig}
          setCustomConfig={setCustomConfig}
        />
      </div>

      {/* Right Column: Live QR Preview & Actions */}
      <QRPreview
        dataString={qrDataString}
        title={displayTitle}
        contentType={contentType}
        customConfig={customConfig}
        onSaveRecord={handleSave}
        isSaving={isSaving}
        viewerUrl={viewerUrl}
      />

      {/* Floating QR Quick-View FAB for mobile */}
      <button
        type="button"
        className="mobile-qr-fab"
        onClick={() => {
          document.querySelector('.qr-preview-wrapper')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <QrCode size={16} />
        <span>View QR Preview</span>
      </button>

      {/* Magic AI Prompt Modal */}
      <AIStudioPrompt
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onApplyGeneration={handleApplyAIGeneration}
      />
    </div>
  );
};

