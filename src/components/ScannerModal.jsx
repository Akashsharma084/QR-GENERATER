import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, Copy, Check, ExternalLink, QrCode, AlertCircle, Wifi, CreditCard } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export const ScannerModal = ({ isOpen, onClose, onNavigateToViewer }) => {
  const [activeMode, setActiveMode] = useState('camera'); // 'camera' | 'file'
  const [scanResult, setScanResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode]);

  const startCamera = async () => {
    setErrorMsg('');
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader-container');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleDecoded(decodedText);
          stopCamera();
        },
        (errorMessage) => {
          // ignore scan frame errors
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.warn('Camera scan start failed:', err);
      setErrorMsg('Camera access is not permitted or unavailable on this device. Try uploading an image of the QR code instead.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (e) {
        // ignore stop error
      }
    }
  };

  const handleDecoded = (decodedText) => {
    setScanResult(decodedText);
    stopCamera();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    try {
      const qrScanner = new Html5Qrcode('qr-reader-hidden');
      const result = await qrScanner.scanFile(file, true);
      handleDecoded(result);
    } catch (err) {
      console.error('File scan error:', err);
      setErrorMsg('No QR code could be detected in this image. Please ensure the image is clear and well lit.');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOmniViewUrl = scanResult.includes('#view/') || scanResult.includes('/view/');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <QrCode size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Scan QR Code</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Scan with your webcam or upload a QR image
            </p>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="segmented-control" style={{ marginBottom: '18px' }}>
          <button
            type="button"
            className={`seg-btn ${activeMode === 'camera' ? 'active' : ''}`}
            onClick={() => {
              setScanResult('');
              setActiveMode('camera');
            }}
          >
            <Camera size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Camera Scanner
          </button>
          <button
            type="button"
            className={`seg-btn ${activeMode === 'file' ? 'active' : ''}`}
            onClick={() => {
              setScanResult('');
              setActiveMode('file');
            }}
          >
            <Upload size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Upload Image
          </button>
        </div>

        {/* Camera container */}
        {activeMode === 'camera' && !scanResult && (
          <div>
            <div
              id="qr-reader-container"
              style={{
                width: '100%',
                minHeight: '260px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#000'
              }}
            />
          </div>
        )}

        {/* File upload container */}
        {activeMode === 'file' && !scanResult && (
          <div
            className="file-dropzone"
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '40px 20px' }}
          >
            <div className="dropzone-icon">
              <Upload size={24} />
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Choose QR image from computer</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>JPG, PNG, WebP screenshot or photo</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        )}

        <div id="qr-reader-hidden" style={{ display: 'none' }} />

        {errorMsg && (
          <div style={{
            marginTop: '14px',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scan Result Dialog */}
        {scanResult && (
          <div style={{
            marginTop: '16px',
            padding: '18px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-bright)'
          }}>
            <p style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              ✓ QR Code Decoded Successfully
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-all',
              maxHeight: '140px',
              overflowY: 'auto',
              marginBottom: '16px',
              color: '#f1f5f9'
            }}>
              {scanResult}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isOmniViewUrl ? (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const id = scanResult.split('#view/')[1] || scanResult.split('/view/')[1];
                    if (id && onNavigateToViewer) {
                      onNavigateToViewer(id);
                      onClose();
                    } else {
                      window.open(scanResult, '_blank');
                    }
                  }}
                >
                  <ExternalLink size={16} />
                  <span>Open Interactive View</span>
                </button>
              ) : scanResult.startsWith('http') ? (
                <a
                  href={scanResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  <ExternalLink size={16} />
                  <span>Open URL</span>
                </a>
              ) : scanResult.startsWith('upi://') ? (
                <a
                  href={scanResult}
                  className="btn-primary"
                  style={{ flex: 1, background: 'var(--grad-payment)' }}
                >
                  <CreditCard size={16} />
                  <span>Launch UPI Payment</span>
                </a>
              ) : null}

              <button
                type="button"
                className="btn-secondary"
                onClick={copyResult}
              >
                {copied ? <Check size={16} style={{ color: '#34d399' }} /> : <Copy size={16} />}
                <span>{copied ? 'Copied' : 'Copy Data'}</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setScanResult('');
                  if (activeMode === 'camera') startCamera();
                }}
              >
                <span>Scan Another</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
