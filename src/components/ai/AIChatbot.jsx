import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, ArrowLeft, Trash2, Download, ExternalLink, Sparkles, 
  CheckCircle2, Copy, Check, MessageSquare, Paperclip, RefreshCw, Wand2 
} from 'lucide-react';
import { RoboLogo } from '../common/RoboLogo';
import { parseAIPrompt } from '../../utils/aiPromptParser';
import { createQRCodeInstance, downloadQRCode } from '../../utils/qrGenerator';
import { saveQRRecord } from '../../services/qrDataService';

/**
 * Interactive In-Chat QR Card
 * Renders a live QR code inside the chat bubble with 1-click Download and Open in Studio
 */
const ChatQRCard = ({ qrResult, onOpenInStudio }) => {
  const containerRef = useRef(null);
  const qrRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const { contentType, formData, customConfig, recordId, displayTitle, qrDataString, viewerUrl } = qrResult;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const qrInstance = createQRCodeInstance({
      data: qrDataString || viewerUrl || 'https://omni-qr.app',
      width: 170,
      height: 170,
      ...customConfig
    });

    qrInstance.append(containerRef.current);
    qrRef.current = qrInstance;
  }, [qrDataString, viewerUrl, customConfig]);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    setDownloading(true);
    try {
      const fileName = `${displayTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr.png`;
      await downloadQRCode(qrRef.current, 'png', fileName);
    } catch (err) {
      console.warn('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{
      marginTop: '12px',
      background: 'rgba(10, 15, 28, 0.95)',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{
          fontSize: '0.7rem',
          padding: '2px 8px',
          borderRadius: '9999px',
          background: 'rgba(168, 85, 247, 0.25)',
          color: '#f0abfc',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {contentType} QR Ready
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
          {displayTitle}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* QR Code Canvas */}
        <div
          ref={containerRef}
          style={{
            background: '#ffffff',
            padding: '8px',
            borderRadius: '12px',
            display: 'inline-flex',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            flexShrink: 0
          }}
        />

        {/* Info & Action Buttons */}
        <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {contentType === 'payment' && (
              <>Payee: <strong>{formData.payeeName}</strong> • {formData.currency || 'INR'} {formData.amount || ''}<br />UPI: <code>{formData.upiId}</code></>
            )}
            {contentType === 'movie' && (
              <>Movie: <strong>{formData.movieTitle}</strong><br />Stream: {formData.videoUrl || 'Interactive Showcase'}</>
            )}
            {contentType === 'music' && (
              <>Song: <strong>{formData.trackTitle}</strong><br />Artist: {formData.artistName}</>
            )}
            {contentType === 'image' && (
              <>Image: <strong>{formData.imageTitle}</strong><br />Gallery Showcase</>
            )}
            {contentType === 'document' && (
              <>Document: <strong>{formData.docTitle}</strong><br />Cloud PDF</>
            )}
            {contentType === 'info' && (
              formData.infoType === 'wifi' ? <>WiFi: <strong>{formData.wifiSsid}</strong></> :
              formData.infoType === 'vcard' ? <>Contact: <strong>{formData.firstName} {formData.lastName}</strong></> :
              <>Link: <strong>{formData.urlLink || 'Web Link'}</strong></>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onOpenInStudio(qrResult)}
              style={{
                fontSize: '0.8rem',
                padding: '7px 14px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Wand2 size={14} />
              <span>Open in Studio Editor 🎨</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleDownload}
              disabled={downloading}
              style={{
                fontSize: '0.8rem',
                padding: '7px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} />
              <span>{downloading ? 'Downloading...' : 'Quick Download PNG'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIChatbot = ({ onBackToGrid, onApplyToStudio }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste! Main hoon aapka **Omni Robo AI**.\n\nAapko kis cheez ka QR code banana hai? Mujhe batayein aur apna link, file, text, UPI ID, gaana ya photo details share karein. Main use turant interactive smart QR code me convert kar dunga!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Chat reset kar di gayi hai. Aap kisi bhi naye link ya resource ka QR code banane ke liye batayein!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = inputVal.trim();
    if (!text || isThinking) return;

    // 1. Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsThinking(true);

    try {
      // 2. Parse natural language + user resources
      const aiResult = await parseAIPrompt(text);
      const recordId = 'omni_' + Math.random().toString(36).substring(2, 9);
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const viewerUrl = `${origin}${pathname}#view/${recordId}`;

      // Derive display title
      let displayTitle = 'OmniQR Code';
      const cType = aiResult.contentType;
      const fData = aiResult.formData || {};

      if (cType === 'payment') {
        displayTitle = `${fData.payeeName || 'Payment'} (${fData.currency || 'INR'} ${fData.amount || ''})`.trim();
      } else if (cType === 'movie') {
        displayTitle = fData.movieTitle || 'Movie Showcase';
      } else if (cType === 'music') {
        displayTitle = `${fData.trackTitle || 'Track'} - ${fData.artistName || 'Artist'}`;
      } else if (cType === 'image') {
        displayTitle = fData.imageTitle || 'Photo Gallery';
      } else if (cType === 'document') {
        displayTitle = fData.docTitle || 'Document';
      } else if (cType === 'info') {
        displayTitle = fData.infoType === 'wifi' ? `WiFi: ${fData.wifiSsid}` :
                       fData.infoType === 'vcard' ? `${fData.firstName} ${fData.lastName}` :
                       (fData.urlLink || 'Web Link');
      }

      // Check if direct UPI payment
      let qrDataString = viewerUrl;
      if (cType === 'payment' && fData.paymentMode === 'direct') {
        const params = new URLSearchParams();
        params.append('pa', fData.upiId || 'alexcoffee@okaxis');
        params.append('pn', fData.payeeName || 'Alex Coffee');
        params.append('am', fData.amount || '150');
        params.append('cu', fData.currency || 'INR');
        if (fData.paymentNote) params.append('tn', fData.paymentNote);
        qrDataString = `upi://pay?${params.toString()}`;
      } else if (cType === 'info' && fData.infoType === 'link' && fData.urlLink) {
        qrDataString = fData.urlLink;
      }

      const fullRecord = {
        recordId,
        contentType: cType,
        displayTitle,
        formData: fData,
        customConfig: aiResult.customConfig,
        qrDataString,
        viewerUrl
      };

      // Save to background storage so scan immediately works
      saveQRRecord({
        id: recordId,
        type: cType,
        title: displayTitle,
        content: { ...fData },
        customConfig: { ...aiResult.customConfig }
      }).catch(() => {});

      // Bot conversational response
      let replyText = `🎉 Zabardast! Maine aapka **${displayTitle}** QR code generate kar diya hai.`;
      if (cType === 'payment') {
        replyText += `\nDirect UPI scan activate ho gaya hai (Payee: ${fData.payeeName}, Amount: ₹${fData.amount}).`;
      } else if (cType === 'movie') {
        replyText += `\nCinema showcase link bind ho gaya hai. Scan karne par video stream aur poster khulega.`;
      } else if (cType === 'music') {
        replyText += `\nAudio player & album art bind ho gaya hai (${fData.trackTitle} by ${fData.artistName}).`;
      } else if (cType === 'image') {
        replyText += `\nUltra HD image gallery generate ho gayi hai.`;
      } else if (cType === 'document') {
        replyText += `\nDocument PDF viewer activate ho gaya hai.`;
      } else if (cType === 'info') {
        replyText += fData.infoType === 'wifi' ? `\nWiFi credentials bind ho gaye hain.` : `\nSmart link bind ho gaya hai.`;
      }

      replyText += `\nAap ise niche se download kar sakte hain ya **Open in Studio Editor** par click karke customize kar sakte hain!`;

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        qrResult: fullRecord,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Oops! Prompt process karne me thoda samay laga. Kripya apna resource (jaise link ya details) dobara batayein.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Header */}
      <div className="chatbot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="back-to-apps-btn"
            onClick={onBackToGrid}
            title="Return to Feature Apps Launcher"
            style={{ padding: '6px 12px' }}
          >
            <ArrowLeft size={16} />
            <span>All Feature Apps</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.25))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RoboLogo size={26} animated={true} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Omni Robo AI</span>
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                Online • Conversational QR Generator
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleClearChat}
          title="Clear Conversation"
          style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Trash2 size={13} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="chatbot-messages">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`chat-message-row ${isUser ? 'user-row' : 'bot-row'}`}>
              {!isUser && (
                <div className="chat-avatar-bot">
                  <RoboLogo size={22} animated={false} glow={false} />
                </div>
              )}

              <div className={`chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.55' }}>
                  {m.text}
                </div>

                {/* If message has generated QR result, render in-chat interactive card */}
                {m.qrResult && (
                  <ChatQRCard
                    qrResult={m.qrResult}
                    onOpenInStudio={onApplyToStudio}
                  />
                )}

                <div className="chat-timestamp">
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="chat-message-row bot-row">
            <div className="chat-avatar-bot">
              <RoboLogo size={22} animated={true} glow={false} />
            </div>
            <div className="chat-bubble bot-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '14px',
                height: '14px',
                border: '2px solid rgba(168, 85, 247, 0.4)',
                borderTopColor: '#c084fc',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <span style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 600 }}>
                Omni Robo is analyzing your resource and synthesizing QR...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Chat Input Bar */}
      <form className="chatbot-input-bar" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Apna prompt likhein ya koi link, UPI, text, gaana paste karein..."
          disabled={isThinking}
          className="chatbot-input-field"
        />

        <button
          type="submit"
          className="chatbot-send-btn"
          disabled={isThinking || !inputVal.trim()}
          title="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
