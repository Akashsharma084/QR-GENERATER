import React, { useState, useEffect } from 'react';
import { X, Database, Check, ShieldCheck, ExternalLink, Cloud, Zap } from 'lucide-react';
import { getStoredFirebaseConfig, saveFirebaseConfig, initFirebase } from '../config/firebase';

export const FirebaseModal = ({ isOpen, onClose, onConfigSaved }) => {
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredFirebaseConfig();
      if (stored) {
        setConfig(stored);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Cloud size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Firebase Spark Cloud</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Project: <strong style={{ color: '#34d399' }}>qr-generator-9da7e</strong>
            </p>
          </div>
        </div>

        {/* Plan Details Card */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
            <ShieldCheck size={18} />
            <span>Active on 100% Free Spark Plan</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            No credit card required. Free tier includes <strong>50,000 document reads/day</strong>, <strong>20,000 writes/day</strong>, and <strong>1GB cloud storage</strong>.
          </p>
        </div>

        {/* Cloud Database Setup Step */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '6px', color: '#fff' }}>
            ⚡ 1-Click Database Activation:
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
            To allow your phone and other devices to sync documents in the cloud, make sure Cloud Firestore is enabled in your Firebase console:
          </p>
          <a
            href="https://console.firebase.google.com/project/qr-generator-9da7e/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', padding: '9px 14px' }}
          >
            <ExternalLink size={15} />
            <span>Open Firestore in Firebase Console</span>
          </a>
        </div>

        {/* Current Credentials overview */}
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(0,0,0,0.25)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>Project ID: {config.projectId || 'qr-generator-9da7e'}</div>
          <div>Hosting: qr-generator-9da7e.web.app</div>
          <div>Storage: {config.storageBucket || 'qr-generator-9da7e.firebasestorage.app'}</div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', marginTop: '20px' }}
          onClick={onClose}
        >
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
