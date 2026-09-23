import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QRStudio } from './components/QRStudio';
import { HistoryVault } from './components/HistoryVault';
import { ScannerModal } from './components/ScannerModal';
import { SharedContentViewer } from './views/SharedContentViewer';
import { initFirebase } from './config/firebase';

export function App() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'vault'
  const [scannerOpen, setScannerOpen] = useState(false);
  const [viewerRecordId, setViewerRecordId] = useState(null);
  const [resetGridTrigger, setResetGridTrigger] = useState(0);

  // Check URL hash for direct viewer links e.g. #view/123
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#view/')) {
        const id = hash.replace('#view/', '');
        setViewerRecordId(id);
      } else {
        setViewerRecordId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialize Firebase credentials check silently in the background
  useEffect(() => {
    initFirebase();
  }, []);

  const handleNavigateToViewer = (id) => {
    window.location.hash = `#view/${id}`;
  };

  const handleBackToStudio = () => {
    window.location.hash = '';
    setViewerRecordId(null);
    setActiveTab('create');
    setResetGridTrigger(prev => prev + 1);
  };

  const handleTabCreate = () => {
    setActiveTab('create');
    setResetGridTrigger(prev => prev + 1);
  };

  // If viewing a scanned QR code page
  if (viewerRecordId) {
    return (
      <SharedContentViewer
        recordId={viewerRecordId}
        onBackToStudio={handleBackToStudio}
      />
    );
  }

  return (
    <>
      <Navbar
        activeTab={activeTab}
        onTabCreate={handleTabCreate}
        onSelectVault={() => setActiveTab('vault')}
        onOpenScanner={() => setScannerOpen(true)}
      />

      <main className="app-container">
        {activeTab === 'create' && (
          <QRStudio
            resetGridTrigger={resetGridTrigger}
            onSavedSuccess={(savedRecord) => {
              // Optionally can offer a link to view in vault
            }}
          />
        )}

        {activeTab === 'vault' && (
          <HistoryVault
            onSelectQR={(item) => {
              window.location.hash = `#view/${item.id}`;
            }}
            onBackToCreate={handleTabCreate}
          />
        )}
      </main>

      {/* Scanner Modal */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onNavigateToViewer={handleNavigateToViewer}
      />
    </>
  );
}

export default App;
