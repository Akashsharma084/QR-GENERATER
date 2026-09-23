import React, { useState, useEffect } from 'react';
import { 
  Search, Trash2, ExternalLink, Download, Eye, QrCode, Sparkles, Filter, 
  CreditCard, Film, Music, Image as ImageIcon, FileText, UserPlus 
} from 'lucide-react';
import { getAllQRRecords, deleteQRRecord } from '../services/qrDataService';

export const HistoryVault = ({ onSelectQR, onBackToCreate }) => {
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getAllQRRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load history vault:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this QR code from your vault?')) {
      await deleteQRRecord(id);
      loadRecords();
    }
  };

  const filtered = records.filter(r => {
    const matchesFilter = filterType === 'all' || r.type === filterType;
    const matchesSearch = !searchQuery || 
      (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.type && r.type.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment': return <CreditCard size={14} style={{ color: '#10b981' }} />;
      case 'movie': return <Film size={14} style={{ color: '#f43f5e' }} />;
      case 'music': return <Music size={14} style={{ color: '#a855f7' }} />;
      case 'image': return <ImageIcon size={14} style={{ color: '#0ea5e9' }} />;
      case 'document': return <FileText size={14} style={{ color: '#f59e0b' }} />;
      default: return <UserPlus size={14} style={{ color: '#6366f1' }} />;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Header & Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>History & Source Vault</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage, re-export, and track scans for your dynamic and custom QR codes
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search QRs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '36px' }}
            />
          </div>
          <button type="button" className="btn-primary" onClick={onBackToCreate}>
            <Sparkles size={16} />
            <span>Create New QR</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
        {[
          { id: 'all', label: 'All Items' },
          { id: 'payment', label: 'Payments' },
          { id: 'movie', label: 'Movies & Video' },
          { id: 'music', label: 'Music & Audio' },
          { id: 'image', label: 'Photos' },
          { id: 'document', label: 'Documents' },
          { id: 'info', label: 'Info & vCard' }
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`type-pill ${filterType === cat.id ? 'active' : ''}`}
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            onClick={() => setFilterType(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Records Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your vault...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <QrCode size={48} style={{ color: 'var(--text-dim)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No QR Codes Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            {searchQuery ? 'No QR codes matched your search terms.' : 'Create your first QR code for movies, music, photos, payments, or contacts!'}
          </p>
          <button type="button" className="btn-primary" onClick={onBackToCreate}>
            <Sparkles size={16} />
            <span>Generate First QR</span>
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {filtered.map(item => (
            <div
              key={item.id}
              className="history-card"
              onClick={() => onSelectQR(item)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)'
                }}>
                  {getTypeIcon(item.type)}
                  <span>{item.type}</span>
                </span>

                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Eye size={12} />
                  <span>{item.scanCount || 0} scans</span>
                </span>
              </div>

              <div>
                <h4 style={{
                  fontSize: '1.05rem',
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: 'auto'
              }}>
                <a
                  href={`#view/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--primary-light)' }}
                >
                  <ExternalLink size={14} />
                  <span>Open View</span>
                </a>

                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item.id)}
                  style={{ color: '#ef4444', padding: '4px 6px', borderRadius: '6px' }}
                  title="Delete QR"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
