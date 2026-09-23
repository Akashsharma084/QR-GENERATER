import React, { useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, Copy, Check, Bookmark, Sparkles, FileCode, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createQRCodeInstance, downloadQRCode } from '../utils/qrGenerator';

export const QRPreview = ({
  dataString,
  title,
  contentType,
  customConfig,
  onSaveRecord,
  isSaving,
  viewerUrl
}) => {
  const containerRef = useRef(null);
  const qrInstanceRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('png');

  // Initialize or update QR Code Styling
  useEffect(() => {
    if (!containerRef.current) return;

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = createQRCodeInstance({
        data: dataString || 'https://omni-qr.app',
        ...customConfig
      });
      containerRef.current.innerHTML = '';
      qrInstanceRef.current.append(containerRef.current);
    } else {
      const dotsOptions = {
        type: customConfig.dotType
      };

      if (customConfig.gradient && customConfig.gradient.colorStops) {
        dotsOptions.gradient = customConfig.gradient;
      } else {
        dotsOptions.color = customConfig.dotColor;
      }

      qrInstanceRef.current.update({
        data: dataString || 'https://omni-qr.app',
        dotsOptions,
        cornersSquareOptions: {
          type: customConfig.cornerSquareType,
          color: customConfig.cornerSquareColor || customConfig.dotColor
        },
        cornersDotOptions: {
          type: customConfig.cornerDotType,
          color: customConfig.cornerDotColor || customConfig.dotColor
        },
        image: customConfig.logo || undefined
      });
    }
  }, [dataString, customConfig]);

  const handleCopyLink = () => {
    const toCopy = viewerUrl || dataString;
    navigator.clipboard.writeText(toCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (ext = 'png', highRes = false) => {
    if (!qrInstanceRef.current) return;

    const safeName = (title || 'omni-qr').toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (highRes) {
      // Create high-res clone for export
      const exportInstance = createQRCodeInstance({
        data: dataString || 'https://omni-qr.app',
        width: 1000,
        height: 1000,
        ...customConfig
      });
      downloadQRCode(exportInstance, `${safeName}-hd`, ext);
    } else {
      downloadQRCode(qrInstanceRef.current, safeName, ext);
    }
  };

  const handleSaveToVault = async () => {
    if (onSaveRecord) {
      await onSaveRecord();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleTestLandingPage = async () => {
    if (onSaveRecord) {
      await onSaveRecord();
    }
    window.open(viewerUrl, '_blank');
  };

  return (
    <div className="qr-preview-wrapper">
      <div className="qr-card-canvas-container">
        {/* Printable styled Card Frame */}
        <div className="qr-card-frame">
          {customConfig.frameLabel && (
            <div className="qr-frame-badge">
              <Sparkles size={14} style={{ color: customConfig.dotColor || '#6366f1' }} />
              <span>{customConfig.frameLabel}</span>
            </div>
          )}

          <div ref={containerRef} className="qr-canvas-holder" />

          <div className="qr-frame-footer">
            SCAN WITH ANY CAMERA
          </div>
        </div>

        <div className="qr-meta-title" title={title || 'Untitled QR'}>
          {title || 'Untitled QR'}
        </div>

        <div
          className="qr-meta-type-badge"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {contentType}
        </div>
      </div>

      {/* Main Save / Share / Download actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSaveToVault}
          disabled={isSaving}
        >
          <Bookmark size={18} />
          <span>{isSaving ? 'Saving to Vault...' : 'Save & Publish QR'}</span>
        </button>

        {viewerUrl && (
          <button
            type="button"
            className="btn-secondary"
            onClick={handleTestLandingPage}
            style={{ width: '100%' }}
          >
            <ExternalLink size={16} />
            <span>Test Receiver Landing Page</span>
          </button>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={handleCopyLink}
        >
          {copied ? <Check size={16} style={{ color: '#34d399' }} /> : <Copy size={16} />}
          <span>{copied ? 'Link Copied!' : 'Copy Shareable Link'}</span>
        </button>

        <div className="export-grid">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleDownload('png', false)}
          >
            <ImageIcon size={15} />
            <span>Download PNG</span>
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleDownload('svg', false)}
          >
            <FileCode size={15} />
            <span>Vector SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
