import React from 'react';
import { QrCode, Sparkles, Database, ScanLine, Layers, CheckCircle2, Cloud } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenScanner, onOpenFirebase, isFirebaseConfigured }) => {
  return (
    <>
      {/* Top Mobile/Desktop Header */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand-badge" onClick={() => setActiveTab('create')}>
            <div className="brand-logo-icon">
              <QrCode size={20} />
            </div>
            <div>
              <div className="brand-title">OmniQR <span style={{ color: 'var(--primary-light)', fontWeight: 400 }}>Studio</span></div>
              <div className="brand-subtitle">Universal Smart QR Hub</div>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="nav-actions desktop-nav">
            <button
              id="tab-create-btn"
              className={`nav-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <Sparkles size={16} />
              <span>Create</span>
            </button>

            <button
              id="tab-vault-btn"
              className={`nav-tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
              onClick={() => setActiveTab('vault')}
            >
              <Layers size={16} />
              <span>Vault</span>
            </button>

            <button
              id="tab-scan-btn"
              className="nav-tab-btn"
              onClick={onOpenScanner}
            >
              <ScanLine size={16} />
              <span>Scan QR</span>
            </button>

            <button
              id="firebase-status-btn"
              className="firebase-status-chip"
              onClick={onOpenFirebase}
              title="Connected to Firebase Spark Plan"
            >
              <Cloud size={13} style={{ color: '#34d399' }} />
              <span>Spark Cloud</span>
            </button>
          </nav>

          {/* Mobile Top Status Pill */}
          <div className="mobile-top-action">
            <button
              className="firebase-status-chip"
              onClick={onOpenFirebase}
              title="Firebase Cloud Status"
            >
              <Cloud size={12} style={{ color: '#34d399' }} />
              <span>Spark</span>
            </button>
          </div>
        </div>
      </header>

      {/* Native Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-app-bar">
        <button
          type="button"
          className={`mobile-bar-item ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <div className="mobile-bar-icon-wrap">
            <Sparkles size={20} />
          </div>
          <span>Create</span>
        </button>

        <button
          type="button"
          className={`mobile-bar-item ${activeTab === 'vault' ? 'active' : ''}`}
          onClick={() => setActiveTab('vault')}
        >
          <div className="mobile-bar-icon-wrap">
            <Layers size={20} />
          </div>
          <span>Vault</span>
        </button>

        <button
          type="button"
          className="mobile-bar-item scanner-highlight"
          onClick={onOpenScanner}
        >
          <div className="mobile-bar-icon-wrap scanner-btn-glow">
            <ScanLine size={22} />
          </div>
          <span>Scan</span>
        </button>

        <button
          type="button"
          className="mobile-bar-item"
          onClick={onOpenFirebase}
        >
          <div className="mobile-bar-icon-wrap">
            <Cloud size={20} />
          </div>
          <span>Cloud</span>
        </button>
      </nav>
    </>
  );
};
