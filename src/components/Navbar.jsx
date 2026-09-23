import React from 'react';
import { QrCode, Sparkles, ScanLine, Layers } from 'lucide-react';

export const Navbar = ({ activeTab, onTabCreate, onOpenScanner, onSelectVault }) => {
  return (
    <>
      {/* Top Mobile/Desktop Header */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand-badge" onClick={onTabCreate} style={{ cursor: 'pointer' }}>
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
              onClick={onTabCreate}
            >
              <Sparkles size={16} />
              <span>Create Apps</span>
            </button>

            <button
              id="tab-vault-btn"
              className={`nav-tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
              onClick={onSelectVault}
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
          </nav>
        </div>
      </header>

      {/* Native Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-app-bar">
        <button
          type="button"
          className={`mobile-bar-item ${activeTab === 'create' ? 'active' : ''}`}
          onClick={onTabCreate}
        >
          <div className="mobile-bar-icon-wrap">
            <Sparkles size={20} />
          </div>
          <span>Create</span>
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
          className={`mobile-bar-item ${activeTab === 'vault' ? 'active' : ''}`}
          onClick={onSelectVault}
        >
          <div className="mobile-bar-icon-wrap">
            <Layers size={20} />
          </div>
          <span>Vault</span>
        </button>
      </nav>
    </>
  );
};

export default Navbar;
