import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QRStudio } from './components/QRStudio';
import { HistoryVault } from './components/HistoryVault';
import { ScannerModal } from './components/ScannerModal';
import { FirebaseModal } from './components/FirebaseModal';
import { SharedContentViewer } from './views/SharedContentViewer';
import { getFirebaseServices, initFirebase } from './config/firebase';

export function App() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'vault'
  const [scannerOpen, setScannerOpen] = useState(false);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);
  const [viewerRecordId, setViewerRecordId] = useState(null);

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

  // Initialize Firebase credentials check
  useEffect(() => {
    const status = initFirebase();
    setIsFirebaseConfigured(status.isConfigured);
  }, []);

  const handleNavigateToViewer = (id) => {
    window.location.hash = `#view/${id}`;
  };

  const handleBackToStudio = () => {
    window.location.hash = '';
    setViewerRecordId(null);
    setActiveTab('create');
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
        setActiveTab={setActiveTab}
        onOpenScanner={() => setScannerOpen(true)}
        onOpenFirebase={() => setFirebaseModalOpen(true)}
        isFirebaseConfigured={isFirebaseConfigured}
      />

      <main className="app-container">
        {activeTab === 'create' && (
          <QRStudio
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
            onBackToCreate={() => setActiveTab('create')}
          />
        )}
      </main>

      {/* Scanner Modal */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onNavigateToViewer={handleNavigateToViewer}
      />

      {/* Firebase Cloud Settings Modal */}
      <FirebaseModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
        onConfigSaved={(configured) => setIsFirebaseConfigured(configured)}
      />
    </>
  );
}

export default App;
