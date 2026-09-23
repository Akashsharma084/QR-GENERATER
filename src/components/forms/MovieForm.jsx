import React, { useRef, useState } from 'react';
import { Film, Upload, Trash2, Video, Star, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { uploadMediaFile } from '../../services/storageService';
import { storeMediaBlob } from '../../utils/mediaStorage';

const SAMPLE_VIDEOS = [
  {
    title: 'Earth & Cosmic Wonders',
    genre: 'Sci-Fi / Documentary',
    director: 'Planetary Explorations',
    rating: '9.2/10 • 2026',
    synopsis: 'A mesmerizing visual journey through the orbital frontiers of our living world.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    name: 'tears_of_steel.mp4'
  },
  {
    title: 'Wild Horizons Safari',
    genre: 'Adventure / Nature',
    director: 'Apex Wildlife',
    rating: '8.9/10 • 2025',
    synopsis: 'Witness the untold stories of ancient wilderness under twilight skies.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    name: 'big_buck_bunny.mp4'
  }
];

export const MovieForm = ({ formData, setFormData, isUploading, setIsUploading }) => {
  const posterInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [uploadMsg, setUploadMsg] = useState('');

  const update = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadMsg('Uploading poster image...');
      const url = await uploadMediaFile(file, 'posters');
      if (url) {
        update('moviePoster', url);
      }
    } catch (err) {
      console.error('Failed to upload poster:', err);
    } finally {
      setIsUploading(false);
      setUploadMsg('');
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadMsg(`Loading video ${file.name}...`);

      // 1. Store in IndexedDB and generate instant native Blob URL
      const blobUrl = await storeMediaBlob(`video_${Date.now()}_${file.name}`, file);

      update('videoUrl', blobUrl);
      update('videoName', file.name);
      update('videoType', 'direct');

      if (!formData.movieTitle || formData.movieTitle === 'Interstellar: The Journey') {
        update('movieTitle', file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error('Failed to upload video:', err);
      alert('Could not process video file. Please ensure it is a valid MP4 or WebM video.');
    } finally {
      setIsUploading(false);
      setUploadMsg('');
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const applySampleVideo = (sample) => {
    update('movieTitle', sample.title);
    update('movieGenre', sample.genre);
    update('director', sample.director);
    update('ratingYear', sample.rating);
    update('synopsis', sample.synopsis);
    update('videoUrl', sample.videoUrl);
    update('moviePoster', sample.poster);
    update('videoName', sample.name);
    update('videoType', 'direct');
  };

  return (
    <div className="form-container">
      {/* 1-Click Sample Video Helper */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: '12px',
        background: 'rgba(244, 63, 94, 0.08)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#fb7185' }}>
          <Sparkles size={14} />
          <span>Need a sample trailer to test?</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {SAMPLE_VIDEOS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
              onClick={() => applySampleVideo(s)}
            >
              Demo Clip {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-label">Movie / Video Title *</label>
          <input
            type="text"
            placeholder="e.g. Inception, The Midnight Sky"
            value={formData.movieTitle || ''}
            onChange={(e) => update('movieTitle', e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Genre</label>
          <input
            type="text"
            placeholder="e.g. Sci-Fi, Action"
            value={formData.movieGenre || ''}
            onChange={(e) => update('movieGenre', e.target.value)}
          />
        </div>
      </div>

      {/* Video Clip File / URL */}
      <div className="form-group">
        <label className="form-label">Video Clip or Stream URL</label>

        {formData.videoUrl && formData.videoType === 'direct' ? (
          <div style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formData.videoName || 'Video Ready'}
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
                onClick={() => {
                  update('videoUrl', '');
                  update('videoName', '');
                }}
              >
                <Trash2 size={13} style={{ marginRight: '4px' }} />
                Remove
              </button>
            </div>

            {/* In-form Video Player Preview */}
            <video
              src={formData.videoUrl}
              controls
              playsInline
              style={{ width: '100%', maxHeight: '200px', borderRadius: '10px', background: '#000' }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                style={{ flex: 1 }}
                placeholder="YouTube link, Vimeo, or direct MP4 stream"
                value={formData.videoUrl || ''}
                onChange={(e) => {
                  update('videoUrl', e.target.value);
                  update('videoType', e.target.value.includes('youtube') || e.target.value.includes('youtu.be') ? 'youtube' : 'direct');
                }}
              />
              <button
                type="button"
                className="btn-primary"
                style={{ width: 'auto', padding: '10px 16px', background: 'var(--grad-movie)', whiteSpace: 'nowrap' }}
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload size={16} />
                <span>{isUploading ? 'Uploading...' : 'Upload Clip'}</span>
              </button>
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*,.mp4,.webm,.mov,.m4v,.mkv"
              style={{ display: 'none' }}
              onChange={handleVideoUpload}
            />
          </div>
        )}

        {uploadMsg && (
          <span style={{ fontSize: '0.78rem', color: '#fb7185', marginTop: '4px' }}>
            ⏳ {uploadMsg}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Poster / Cover Backdrop</label>
        {formData.moviePoster ? (
          <div className="preview-thumb-box">
            <img src={formData.moviePoster} alt="Poster" />
            <button
              type="button"
              className="remove-thumb-btn"
              onClick={() => update('moviePoster', '')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div
            className="file-dropzone"
            onClick={() => posterInputRef.current?.click()}
          >
            <div className="dropzone-icon">
              <Film size={22} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click or drop movie poster</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>JPG, PNG or WebP</p>
            </div>
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePosterUpload}
            />
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Director / Creator</label>
          <input
            type="text"
            placeholder="e.g. Christopher Nolan"
            value={formData.director || ''}
            onChange={(e) => update('director', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Rating / Year</label>
          <input
            type="text"
            placeholder="e.g. 8.8/10 • 2024"
            value={formData.ratingYear || ''}
            onChange={(e) => update('ratingYear', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Synopsis / Description</label>
        <textarea
          rows={3}
          placeholder="Brief summary or thoughts about this movie/video..."
          value={formData.synopsis || ''}
          onChange={(e) => update('synopsis', e.target.value)}
        />
      </div>
    </div>
  );
};
