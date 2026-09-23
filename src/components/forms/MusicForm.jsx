import React, { useRef, useState } from 'react';
import { Upload, Trash2, Play, Pause, CheckCircle2, Sparkles } from 'lucide-react';
import { storeAudioBlob } from '../../utils/audioStorage';
import { extractAudioMetadata, fetchOnlineAlbumArt, cleanSongTitle, generateSmartCover } from '../../utils/id3Helper';
import { saveAudioChunksToCloud } from '../../utils/cloudAudioSync';

// Universal CORS-enabled public audio streams hosted on Apple's worldwide CDN (100% mobile-friendly)
const SAMPLE_TRACKS = [
  {
    title: 'Cafe Focus Lofi Beats',
    artist: 'Lofi Jazz Terrace',
    url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b1/b8/5b/b1b85b3a-dd1f-eb1d-cd23-c6925e3c54aa/mzaf_15073987598519295647.plus.aac.p.m4a',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e9/bd/99/e9bd99e3-efaa-ffbc-7d64-87bac9aa3e89/4550760013117_cover.jpg/600x600bb.jpg',
    name: 'lofi_chill_beats.m4a'
  },
  {
    title: 'Acoustic Morning Breeze',
    artist: 'Sounds Effects Academy',
    url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/1c/ed/cc/1cedcc6b-983a-0b5f-1f80-0410fbeedb53/mzaf_10203351008801732890.plus.aac.p.m4a',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/f7/df/92/f7df9227-deee-8dc6-8038-07b76a0fb355/8134130862466.jpg/600x600bb.jpg',
    name: 'acoustic_morning.m4a'
  }
];

export const MusicForm = ({ formData, setFormData, isUploading, setIsUploading, recordId }) => {
  const audioInputRef = useRef(null);
  const audioPreviewRef = useRef(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');

  const update = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgressMsg(`Reading ${file.name}...`);

      // 1. Instant native hardware streaming Blob URL stored in IndexedDB for creator preview
      const localBlobUrl = await storeAudioBlob(`audio_${Date.now()}_${file.name}`, file);
      update('audioUrl', localBlobUrl);
      update('audioName', file.name);

      // 2. Background ID3 Tag & Cover Auto-Extraction (Invisible in form, shown when QR is opened)
      setUploadProgressMsg('Scanning audio tags & album art...');
      const metadata = await extractAudioMetadata(file);

      const detectedTitle = metadata?.trackTitle?.trim() || '';
      const detectedArtist = metadata?.artistName?.trim() || '';
      const cleanedFileTitle = cleanSongTitle(file.name);
      const songTitleToUse = detectedTitle || cleanedFileTitle || 'Audio Track';

      // Auto-set title & artist
      update('trackTitle', songTitleToUse);
      if (detectedArtist) {
        update('artistName', detectedArtist);
      }

      // Step A: Embedded artwork in file bytes
      if (metadata && metadata.coverUrl) {
        update('albumCover', metadata.coverUrl);
      }

      // Step B: Search official Apple Music / iTunes public catalog for global mobile stream & HD cover
      setUploadProgressMsg('Auto-syncing global audio stream & HD cover...');
      const queryForCatalog = detectedTitle || cleanedFileTitle;
      const onlineMatch = await fetchOnlineAlbumArt(queryForCatalog, detectedArtist || formData.artistName);

      if (onlineMatch) {
        // Universal high-speed CDN audio stream that plays on ALL mobile devices
        if (onlineMatch.audioUrl) {
          update('audioUrl', onlineMatch.audioUrl);
        }
        if (!metadata?.coverUrl && onlineMatch.coverUrl) {
          update('albumCover', onlineMatch.coverUrl);
        }
        if (onlineMatch.artistName && (!detectedArtist || formData.artistName === 'Synthwave Collective')) {
          update('artistName', onlineMatch.artistName);
        }
        if (onlineMatch.trackTitle && !detectedTitle) {
          update('trackTitle', onlineMatch.trackTitle);
        }
      } else if (!metadata?.coverUrl) {
        // Step C: Generate dynamic personalized vinyl cover
        const smartCover = generateSmartCover(songTitleToUse, detectedArtist || formData.artistName || 'Audio');
        update('albumCover', smartCover);
      }

      // Step D: Also sync audio chunks to cloud so custom unlisted tracks can stream to mobile phones!
      const recId = recordId || formData.id;
      if (recId) {
        saveAudioChunksToCloud(recId, file).then(success => {
          if (success) {
            update('hasCloudAudio', true);
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to load audio file:', err);
      alert('Could not read audio file. Please try a standard MP3 or WAV file.');
    } finally {
      setIsUploading(false);
      setUploadProgressMsg('');
      if (audioInputRef.current) audioInputRef.current.value = '';
    }
  };

  const applySampleTrack = (sample) => {
    update('trackTitle', sample.title);
    update('artistName', sample.artist);
    update('audioUrl', sample.url);
    update('audioName', sample.name);
    update('albumCover', sample.cover);
  };

  const togglePreviewPlay = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch((e) => {
        console.warn('Playback error:', e);
      });
    }
  };

  return (
    <div className="form-container">
      {/* 1-Click Sample Audio Helpers */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: '12px',
        background: 'rgba(168, 85, 247, 0.08)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#c084fc' }}>
          <Sparkles size={14} />
          <span>Need a sample song to test?</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {SAMPLE_TRACKS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
              onClick={() => applySampleTrack(s)}
            >
              Demo Beat {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 1.5 }}>
          <label className="form-label">Track / Song Title *</label>
          <input
            type="text"
            placeholder="e.g. Kesariya, Starboy, My Podcast"
            value={formData.trackTitle || ''}
            onChange={(e) => update('trackTitle', e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Artist / Creator *</label>
          <input
            type="text"
            placeholder="e.g. Arijit Singh, The Weeknd"
            value={formData.artistName || ''}
            onChange={(e) => update('artistName', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Album Artwork & Track Info Card */}
      {formData.albumCover && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          marginBottom: '16px'
        }}>
          <img
            src={formData.albumCover}
            alt="Album Art"
            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {formData.trackTitle || 'Audio Track'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {formData.artistName || 'Artist'} • Official Album Cover
            </div>
          </div>
        </div>
      )}

      {/* Audio File Upload & Player */}
      <div className="form-group">
        <label className="form-label">Audio File (MP3 / WAV / M4A / AAC)</label>
        
        {formData.audioUrl ? (
          <div style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formData.audioName || 'Audio Ready (Global Stream)'}
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
                onClick={() => {
                  if (audioPreviewRef.current) audioPreviewRef.current.pause();
                  setIsPlayingPreview(false);
                  update('audioUrl', '');
                  update('audioName', '');
                }}
              >
                <Trash2 size={13} style={{ marginRight: '4px' }} />
                Remove
              </button>
            </div>

            {/* Test Play in Form Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ width: 'auto', padding: '8px 16px', background: 'var(--grad-music)', fontSize: '0.85rem' }}
                onClick={togglePreviewPlay}
              >
                {isPlayingPreview ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlayingPreview ? 'Pause Audio' : 'Test Play Audio'}</span>
              </button>
              <audio
                ref={audioPreviewRef}
                src={formData.audioUrl}
                playsInline
                preload="auto"
                onPlay={() => setIsPlayingPreview(true)}
                onPause={() => setIsPlayingPreview(false)}
                onEnded={() => setIsPlayingPreview(false)}
                controls
                style={{ flex: 1, height: '36px' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                style={{ flex: 1 }}
                placeholder="Paste direct audio URL or Spotify link"
                value={formData.audioUrl || ''}
                onChange={(e) => update('audioUrl', e.target.value)}
              />
              <button
                type="button"
                className="btn-primary"
                style={{ width: 'auto', padding: '10px 16px', background: 'var(--grad-music)', whiteSpace: 'nowrap' }}
                onClick={() => audioInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload size={16} />
                <span>{isUploading ? 'Uploading...' : 'Choose MP3'}</span>
              </button>
            </div>

            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
              style={{ display: 'none' }}
              onChange={handleAudioUpload}
            />
          </div>
        )}

        {uploadProgressMsg && (
          <span style={{ fontSize: '0.78rem', color: '#c084fc', marginTop: '4px' }}>
            ⏳ {uploadProgressMsg}
          </span>
        )}
      </div>
    </div>
  );
};
