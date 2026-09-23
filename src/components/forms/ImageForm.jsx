import React, { useRef } from 'react';
import { Image, Upload, Trash2, Camera } from 'lucide-react';
import { uploadMediaFile } from '../../services/storageService';

export const ImageForm = ({ formData, setFormData, isUploading, setIsUploading }) => {
  const fileInputRef = useRef(null);

  const update = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadMediaFile(file, 'photos');
      update('imageUrl', url);
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-row">
        <div className="form-group" style={{ flex: 1.5 }}>
          <label className="form-label">Photo / Artwork Title *</label>
          <input
            type="text"
            placeholder="e.g. Sunset in Amalfi, Neon Cyberpunk"
            value={formData.imageTitle || ''}
            onChange={(e) => update('imageTitle', e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Creator / Photographer</label>
          <input
            type="text"
            placeholder="e.g. John Doe Photography"
            value={formData.photographer || ''}
            onChange={(e) => update('photographer', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Image File or Direct Image URL *</label>
        {formData.imageUrl ? (
          <div className="preview-thumb-box">
            <img src={formData.imageUrl} alt="Uploaded" />
            <button
              type="button"
              className="remove-thumb-btn"
              onClick={() => update('imageUrl', '')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              className="file-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-icon">
                <Camera size={22} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click or drop high-res image</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>JPG, PNG, WebP, or GIF</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>or paste URL:</span>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl || ''}
                onChange={(e) => update('imageUrl', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Caption / Story</label>
        <textarea
          rows={3}
          placeholder="Tell the story behind this photo or details for viewers..."
          value={formData.imageCaption || ''}
          onChange={(e) => update('imageCaption', e.target.value)}
        />
      </div>
    </div>
  );
};
