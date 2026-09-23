import React, { useRef } from 'react';
import { FileText, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { uploadMediaFile } from '../../services/storageService';

export const DocumentForm = ({ formData, setFormData, isUploading, setIsUploading }) => {
  const fileInputRef = useRef(null);

  const update = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadMediaFile(file, 'docs');
      update('docUrl', url);
      update('docName', file.name);
      update('docSize', `${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    } catch (err) {
      console.error('Failed to upload document:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-row">
        <div className="form-group" style={{ flex: 1.5 }}>
          <label className="form-label">Document Title *</label>
          <input
            type="text"
            placeholder="e.g. Project Proposal, Annual Report, Resume"
            value={formData.docTitle || ''}
            onChange={(e) => update('docTitle', e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Author / Organization</label>
          <input
            type="text"
            placeholder="e.g. Acme Corp, Design Team"
            value={formData.docAuthor || ''}
            onChange={(e) => update('docAuthor', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">PDF / Document File or Link *</label>
        {formData.docUrl ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={24} style={{ color: '#fbbf24' }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formData.docName || 'Attached Document'}</p>
                {formData.docSize && <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formData.docSize}</p>}
              </div>
            </div>
            <button
              type="button"
              className="remove-thumb-btn"
              style={{ position: 'static' }}
              onClick={() => {
                update('docUrl', '');
                update('docName', '');
                update('docSize', '');
              }}
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
                <Upload size={22} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click or drop PDF / Doc</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>PDF, PPTX, DOCX up to 25MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.pptx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>or document link:</span>
              <input
                type="url"
                placeholder="https://drive.google.com/... or cloud document link"
                value={formData.docUrl || ''}
                onChange={(e) => update('docUrl', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Description / Summary</label>
        <textarea
          rows={3}
          placeholder="Brief description of the document contents or instructions..."
          value={formData.docDesc || ''}
          onChange={(e) => update('docDesc', e.target.value)}
        />
      </div>
    </div>
  );
};
