import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, Pause, Download, Copy, Check, ExternalLink, UserPlus, Wifi, 
  Film, Music, Image as ImageIcon, FileText, ArrowLeft, QrCode, CreditCard, ShieldCheck, Heart,
  Globe
} from 'lucide-react';
import { getQRRecordById, incrementScanCount } from '../services/qrDataService';
import { dataUrlToBlobUrl } from '../utils/audioStorage';
import { loadAudioChunksFromCloud } from '../utils/cloudAudioSync';

export const SharedContentViewer = ({ recordId, onBackToStudio }) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [cloudAudioUrl, setCloudAudioUrl] = useState('');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const data = await getQRRecordById(recordId);
        setRecord(data);
        if (data) {
          // Increment scan count in background
          incrementScanCount(recordId);

          // If music and needs cloud audio (blob URL from creator or hasCloudAudio flag)
          if (data.type === 'music') {
            const raw = data.content?.audioUrl || '';
            if (raw.startsWith('blob:') || data.content?.hasCloudAudio) {
              setIsLoadingAudio(true);
              loadAudioChunksFromCloud(recordId)
                .then(url => {
                  if (url) setCloudAudioUrl(url);
                })
                .finally(() => setIsLoadingAudio(false));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load shared content:', err);
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVCard = (data) => {
    const vcardString = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${data.lastName || ''};${data.firstName || ''};;;`,
      `FN:${`${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Contact'}`,
      data.organization ? `ORG:${data.organization}` : '',
      data.jobTitle ? `TITLE:${data.jobTitle}` : '',
      data.phone ? `TEL;TYPE=CELL,VOICE:${data.phone}` : '',
      data.email ? `EMAIL;TYPE=PREF,INTERNET:${data.email}` : '',
      data.website ? `URL:${data.website}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');

    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(data.firstName || 'contact').toLowerCase()}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="viewer-wrapper">
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="viewer-wrapper">
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', maxWidth: '420px' }}>
          <h2 style={{ marginBottom: '12px' }}>Content Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
            This QR code may have expired or the content was removed.
          </p>
          <button type="button" className="btn-primary" onClick={onBackToStudio}>
            <ArrowLeft size={16} />
            <span>Go to OmniQR Studio</span>
          </button>
        </div>
      </div>
    );
  }

  const { type, content } = record;

  return (
    <div className="viewer-wrapper">
      <div className="viewer-card">
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <button
            type="button"
            onClick={onBackToStudio}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>OmniQR</span>
          </button>
          <span style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            fontWeight: 700
          }}>
            {type}
          </span>
        </div>

        {/* 1. PAYMENT VIEWER */}
        {type === 'payment' && (
          <div className="viewer-body">
            <div className="payment-amount-display">
              {content.amount && Number(content.amount) > 0 ? (
                <div>
                  <span className="payment-currency">
                    {content.currency === 'INR' ? '₹' : content.currency === 'USD' ? '$' : content.currency === 'EUR' ? '€' : content.currency === 'GBP' ? '£' : ''}
                  </span>
                  <span className="payment-val">{content.amount}</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {content.currency}
                  </p>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.6rem', color: '#fff' }}>Open Payment</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter amount in your payment app</p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{content.payeeName}</h2>
              {content.paymentNote && (
                <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>"{content.paymentNote}"</p>
              )}
            </div>

            <div className="payment-actions-list">
              {content.paymentMethod === 'upi' && (
                <>
                  <a
                    href={`upi://pay?pa=${content.upiId}&pn=${encodeURIComponent(content.payeeName || '')}&am=${content.amount || ''}&cu=${content.currency || 'INR'}&tn=${encodeURIComponent(content.paymentNote || '')}`}
                    className="pay-btn-brand upi"
                  >
                    <span>Pay with GPay / PhonePe / Paytm</span>
                    <ExternalLink size={18} />
                  </a>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{content.upiId}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(content.upiId)}
                      style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Copied' : 'Copy UPI'}</span>
                    </button>
                  </div>
                </>
              )}

              {content.paymentMethod === 'paypal' && (
                <a
                  href={`https://paypal.me/${content.paypalHandle.replace(/^@/, '')}${content.amount ? `/${content.amount}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pay-btn-brand paypal"
                >
                  <span>Pay with PayPal</span>
                  <ExternalLink size={18} />
                </a>
              )}

              {content.paymentMethod === 'stripe' && (
                <a
                  href={content.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pay-btn-brand stripe"
                >
                  <span>Checkout with Stripe</span>
                  <ExternalLink size={18} />
                </a>
              )}

              {content.paymentMethod === 'crypto' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    wordBreak: 'break-all',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem'
                  }}>
                    <p style={{ color: 'var(--accent-amber)', marginBottom: '4px', fontWeight: 600 }}>
                      {content.cryptoType} Wallet Address:
                    </p>
                    {content.cryptoAddress}
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => copyToClipboard(content.cryptoAddress)}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Address Copied!' : 'Copy Wallet Address'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. MOVIE / VIDEO VIEWER */}
        {type === 'movie' && (
          <div>
            <div className="viewer-media-hero">
              {content.videoUrl && content.videoType === 'direct' ? (
                <video
                  src={content.videoUrl}
                  poster={content.moviePoster}
                  controls
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', maxHeight: '320px', background: '#000' }}
                />
              ) : content.videoUrl && content.videoUrl.includes('youtube') ? (
                <iframe
                  title={content.movieTitle}
                  width="100%"
                  height="250"
                  src={`https://www.youtube.com/embed/${content.videoUrl.split('v=')[1]?.split('&')[0] || ''}`}
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              ) : content.moviePoster ? (
                <img src={content.moviePoster} alt={content.movieTitle} />
              ) : (
                <Film size={60} style={{ color: 'rgba(255,255,255,0.2)' }} />
              )}
            </div>

            <div className="viewer-body">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {content.movieGenre && (
                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', fontWeight: 600 }}>
                    {content.movieGenre}
                  </span>
                )}
                {content.ratingYear && (
                  <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                    {content.ratingYear}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.45rem', marginBottom: '6px' }}>{content.movieTitle}</h2>
              {content.director && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Directed by {content.director}
                </p>
              )}

              {content.synopsis && (
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
                  {content.synopsis}
                </p>
              )}

              {content.videoUrl && (
                <a
                  href={content.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink size={16} />
                  <span>Watch Streaming Fullscreen</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 3. MUSIC / AUDIO VIEWER */}
        {type === 'music' && (() => {
          const rawUrl = cloudAudioUrl || content.audioUrl || '';
          const audioSrc = rawUrl.startsWith('data:') ? dataUrlToBlobUrl(rawUrl) : rawUrl;
          const isSpotify = rawUrl.includes('spotify.com');
          const spotifyEmbedUrl = isSpotify 
            ? rawUrl.replace('open.spotify.com/', 'open.spotify.com/embed/').split('?')[0] 
            : '';

          const togglePlay = () => {
            if (!audioRef.current) return;
            if (isPlayingAudio) {
              audioRef.current.pause();
              setIsPlayingAudio(false);
            } else {
              audioRef.current.play().then(() => {
                setIsPlayingAudio(true);
              }).catch((e) => {
                console.warn('Playback error:', e);
              });
            }
          };

          return (
            <div className="viewer-body">
              <div className="audio-player-box">
                {/* Clickable Spinning Vinyl Disc */}
                <div 
                  className={`vinyl-disc ${isPlayingAudio ? 'playing' : ''}`}
                  onClick={togglePlay}
                  style={{ cursor: 'pointer', position: 'relative' }}
                  title="Click to Play / Pause"
                >
                  <div className="vinyl-center">
                    {content.albumCover ? (
                      <img src={content.albumCover} alt={content.trackTitle} />
                    ) : (
                      <Music size={22} style={{ color: '#fff', margin: '10px auto' }} />
                    )}
                  </div>
                  {/* Overlay play badge */}
                  <div style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    {isPlayingAudio ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>{content.trackTitle}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{content.artistName}</p>
                </div>

                {isLoadingAudio && (
                  <p style={{ fontSize: '0.8rem', color: '#c084fc' }}>
                    ⏳ Preparing cloud audio stream...
                  </p>
                )}

                {/* Spotify Embed Player */}
                {isSpotify && spotifyEmbedUrl ? (
                  <iframe
                    src={spotifyEmbedUrl}
                    width="100%"
                    height="152"
                    style={{ borderRadius: '12px', border: 'none', marginTop: '10px' }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                ) : audioSrc ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                    {/* Big Touch Play Button */}
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={togglePlay}
                      style={{ background: 'var(--grad-music)' }}
                    >
                      {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
                      <span>{isPlayingAudio ? 'Pause Track' : 'Play Full Track'}</span>
                    </button>

                    <audio
                      ref={audioRef}
                      src={audioSrc}
                      playsInline
                      preload="auto"
                      onPlay={() => setIsPlayingAudio(true)}
                      onPause={() => setIsPlayingAudio(false)}
                      onEnded={() => setIsPlayingAudio(false)}
                      controls
                      style={{ width: '100%' }}
                    />
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: '10px 0' }}>
                    No audio stream available for this track.
                  </p>
                )}

                {content.lyrics && (
                  <div style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    color: '#cbd5e1'
                  }}>
                    <p style={{ fontWeight: 700, color: 'var(--primary-light)', marginBottom: '8px' }}>Lyrics & Notes</p>
                    {content.lyrics}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* 3.5 SOCIAL MEDIA HUB ("Link-in-Bio") VIEWER */}
        {type === 'social' && (
          <div className="viewer-body" style={{ textAlign: 'center' }}>
            {/* Avatar & Verified Badge */}
            <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 14px' }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #a855f7',
                boxShadow: '0 0 24px rgba(168, 85, 247, 0.4)',
                background: 'rgba(0,0,0,0.3)'
              }}>
                {content.socialAvatar ? (
                  <img src={content.socialAvatar} alt={content.socialName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--grad-primary)', color: '#fff', fontSize: '2rem', fontWeight: 700 }}>
                    {(content.socialName || 'O')[0].toUpperCase()}
                  </div>
                )}
              </div>

              {content.verifiedBadge && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  background: '#0284c7',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #09090b',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }} title="Verified Creator">
                  <ShieldCheck size={14} />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>{content.socialName || 'Omni Creator'}</span>
              </h2>
              {content.socialHandle && (
                <p style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 600, margin: '0 0 8px' }}>
                  {content.socialHandle.startsWith('@') ? content.socialHandle : `@${content.socialHandle}`}
                </p>
              )}
              {content.socialBio && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 auto', maxWidth: '340px' }}>
                  {content.socialBio}
                </p>
              )}
            </div>

            {/* Social Links List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '380px', margin: '0 auto' }}>
              {/* Instagram */}
              {content.instagram && (
                <a
                  href={`https://instagram.com/${content.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(225, 48, 108, 0.35)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Instagram size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Instagram</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{content.instagram.replace('@', '')}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}

              {/* YouTube */}
              {content.youtube && (
                <a
                  href={content.youtube.startsWith('http') ? content.youtube : `https://youtube.com/${content.youtube.startsWith('@') ? content.youtube : '@' + content.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 0, 0, 0.35)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Youtube size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>YouTube</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Subscribe to Channel</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}

              {/* WhatsApp */}
              {content.whatsapp && (
                <a
                  href={`https://wa.me/${content.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(37, 211, 102, 0.35)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <MessageCircle size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>WhatsApp</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Direct Chat & Connect</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}

              {/* Telegram */}
              {content.telegram && (
                <a
                  href={content.telegram.startsWith('http') ? content.telegram : `https://t.me/${content.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(34, 158, 217, 0.35)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#229ed9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Send size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Telegram</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Join Channel / Message</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}

              {/* Twitter / X */}
              {content.twitter && (
                <a
                  href={content.twitter.startsWith('http') ? content.twitter : `https://twitter.com/${content.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#000', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Twitter size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>X (Twitter)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{content.twitter.replace('@', '')}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}

              {/* LinkedIn */}
              {content.linkedin && (
                <a
                  href={content.linkedin.startsWith('http') ? content.linkedin : `https://linkedin.com/in/${content.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(10, 102, 194, 0.35)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Linkedin size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>LinkedIn</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Professional Profile</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}

              {/* GitHub */}
              {content.github && (
                <a
                  href={content.github.startsWith('http') ? content.github : `https://github.com/${content.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#24292e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Github size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>GitHub</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Repositories & Code</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}

              {/* Website */}
              {content.website && (
                <a
                  href={content.website.startsWith('http') ? content.website : `https://${content.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-hub-link-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    color: '#fff',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Globe size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Official Website</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Portfolio & Links</div>
                    </div>
                  </div>
                  <ExternalLink size={16} style={{ color: 'var(--text-dim)' }} />
                </a>
              )}
            </div>

            {/* Quick Share All Links Button */}
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: 'auto', padding: '8px 20px', borderRadius: '9999px', fontSize: '0.82rem', margin: '0 auto' }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: content.socialName || 'OmniQR Social Hub',
                      text: content.socialBio || 'Check out my social links!',
                      url: window.location.href
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Profile link copied to clipboard!');
                  }
                }}
              >
                <Share2 size={14} style={{ marginRight: '6px' }} />
                <span>Share Profile Hub</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. IMAGE VIEWER */}
        {type === 'image' && (
          <div>
            <div className="viewer-media-hero">
              <img src={content.imageUrl} alt={content.imageTitle} style={{ maxHeight: '420px' }} />
            </div>
            <div className="viewer-body">
              <h2 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>{content.imageTitle}</h2>
              {content.photographer && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Photo by {content.photographer}
                </p>
              )}
              {content.imageCaption && (
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
                  {content.imageCaption}
                </p>
              )}
              <a
                href={content.imageUrl}
                download="downloaded-image"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Download size={16} />
                <span>Save Full Resolution Photo</span>
              </a>
            </div>
          </div>
        )}

        {/* 5. DOCUMENT VIEWER */}
        {type === 'document' && (
          <div className="viewer-body" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FileText size={32} />
            </div>

            <h2 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>{content.docTitle}</h2>
            {content.docAuthor && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                By {content.docAuthor}
              </p>
            )}

            {content.docDesc && (
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '24px' }}>
                {content.docDesc}
              </p>
            )}

            {content.docUrl && (
              <a
                href={content.docUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Download size={16} />
                <span>Download Document</span>
              </a>
            )}
          </div>
        )}

        {/* 6. INFO / VCARD / WIFI VIEWER */}
        {type === 'info' && (
          <div className="viewer-body">
            {content.infoType === 'vcard' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  margin: '0 auto 14px'
                }}>
                  {(content.firstName?.[0] || 'C')}
                </div>
                <h2 style={{ fontSize: '1.35rem' }}>{`${content.firstName || ''} ${content.lastName || ''}`.trim()}</h2>
                {content.jobTitle && <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{content.jobTitle} {content.organization ? `at ${content.organization}` : ''}</p>}

                <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {content.phone && (
                    <a href={`tel:${content.phone}`} className="btn-secondary">
                      <span>Call {content.phone}</span>
                    </a>
                  )}
                  {content.email && (
                    <a href={`mailto:${content.email}`} className="btn-secondary">
                      <span>Email {content.email}</span>
                    </a>
                  )}
                  {content.website && (
                    <a href={content.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      <ExternalLink size={15} />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleDownloadVCard(content)}
                >
                  <UserPlus size={16} />
                  <span>Save Contact to Phone</span>
                </button>
              </div>
            )}

            {content.infoType === 'wifi' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Wifi size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>WiFi Network</h3>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '20px' }}>
                  {content.wifiSsid}
                </p>

                {content.wifiPassword ? (
                  <div style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>PASSWORD</p>
                    <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.05em' }}>
                      {content.wifiPassword}
                    </p>
                  </div>
                ) : (
                  <p style={{ color: '#34d399', marginBottom: '20px' }}>Open Network (No password required)</p>
                )}

                {content.wifiPassword && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => copyToClipboard(content.wifiPassword)}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Password Copied!' : 'Copy WiFi Password'}</span>
                  </button>
                )}
              </div>
            )}

            {content.infoType === 'text' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>{content.textTitle || 'Note'}</h2>
                <div style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontSize: '0.92rem',
                  color: '#cbd5e1',
                  marginBottom: '20px'
                }}>
                  {content.textContent}
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => copyToClipboard(content.textContent)}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </button>
              </div>
            )}

            {content.infoType === 'url' && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>External Destination</h2>
                <a
                  href={content.urlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink size={16} />
                  <span>Open {content.urlLink}</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-dim)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          Powered by OmniQR Studio • Free Universal QR Generator
        </div>
      </div>
    </div>
  );
};
