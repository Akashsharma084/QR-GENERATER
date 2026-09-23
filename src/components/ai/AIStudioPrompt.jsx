import React, { useState } from 'react';
import { X, ArrowRight, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { parseAIPrompt } from '../../utils/aiPromptParser';
import { RoboLogo } from '../common/RoboLogo';

const SUGGESTIONS = [
  {
    icon: '☕',
    text: 'Bhai coffee shop ke liye ₹150 UPI QR banao emerald green theme me',
    tag: 'Payment'
  },
  {
    icon: '🌐',
    text: 'Modern website QR code for https://mybrand.io in cyber cyan theme',
    tag: 'Web Link'
  },
  {
    icon: '🎵',
    text: 'Arijit Singh ka Kesariya song QR with romantic red gradient and music disc',
    tag: 'Music'
  },
  {
    icon: '🎬',
    text: 'Futuristic movie showcase for Cyberpunk 2099 sci-fi trailer with cyan glow',
    tag: 'Movie'
  },
  {
    icon: '📶',
    text: 'Studio Guest High-Speed 5G WiFi QR code password Welcome2026',
    tag: 'Wi-Fi'
  }
];

export const AIStudioPrompt = ({ isOpen, onClose, onApplyGeneration }) => {
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepMsg, setStepMsg] = useState('');
  const [lastResult, setLastResult] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (textToUse = null) => {
    const text = textToUse || promptText;
    if (!text.trim()) {
      alert('Please enter a prompt describing what QR code you want to build!');
      return;
    }

    setIsGenerating(true);
    setLastResult(null);

    // Dynamic AI synthesis steps with Robo mascot feedback
    setStepMsg('Robo AI parsing intent & language...');
    await new Promise(r => setTimeout(r, 350));

    setStepMsg('Extracting data tokens, prices, media & handles...');
    await new Promise(r => setTimeout(r, 400));

    setStepMsg('Searching real-time music & generating custom visuals...');
    const result = await parseAIPrompt(text);
    await new Promise(r => setTimeout(r, 350));

    setStepMsg('Finalizing smart QR code structure...');
    await new Promise(r => setTimeout(r, 300));

    setLastResult(result);
    setIsGenerating(false);
    setStepMsg('');

    // Automatically apply to Studio
    if (onApplyGeneration) {
      onApplyGeneration(result);
    }
  };

  const handleSuggestionClick = (sug) => {
    setPromptText(sug.text);
    handleGenerate(sug.text);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.98), rgba(9, 9, 14, 0.99))',
        border: '1px solid rgba(168, 85, 247, 0.45)',
        boxShadow: '0 24px 60px rgba(168, 85, 247, 0.3), 0 0 50px rgba(0,0,0,0.85)',
        borderRadius: '24px',
        padding: '22px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background circle */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Header with Robot Logo Mascot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.25))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)'
            }}>
              <RoboLogo size={32} animated={true} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Omni Robo AI Mode</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(168,85,247,0.25)', border: '1px solid rgba(168,85,247,0.5)', color: '#f0abfc', fontWeight: 700 }}>
                  ROBO AI 2.0
                </span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Autonomous Smart QR Generator
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Robo Speech Bubble Greeting */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '14px',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>🤖</span>
          <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: 0, lineHeight: '1.45' }}>
            <strong>Omni Robo:</strong> "Kuch bhi likhein Hindi ya English me — jaise <em>'Coffee shop ke liye ₹150 UPI QR banao emerald theme me'</em> — aur main poora QR design kar dunga!"
          </p>
        </div>

        {/* Prompt Input Box */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type what you want to create... (e.g. '₹250 pizza payment QR', 'Arijit Singh Kesariya music QR', 'Cyberpunk movie trailer QR')"
            style={{
              width: '100%',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#fff',
              padding: '12px 14px',
              fontSize: '0.88rem',
              resize: 'none',
              outline: 'none',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
              fontFamily: 'inherit'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />

          <button
            type="button"
            className="btn-primary"
            disabled={isGenerating || !promptText.trim()}
            onClick={() => handleGenerate()}
            style={{
              marginTop: '10px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              boxShadow: '0 4px 18px rgba(168, 85, 247, 0.45)',
              fontSize: '0.9rem',
              padding: '11px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RoboLogo size={18} animated={false} glow={false} />
            <span>{isGenerating ? (stepMsg || 'Omni Robo Generating...') : 'Generate with Omni Robo'}</span>
          </button>
        </div>

        {/* Step Progress Display */}
        {isGenerating && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: 'rgba(168, 85, 247, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            marginBottom: '14px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(168,85,247,0.3)',
              borderTopColor: '#c084fc',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 600 }}>
              {stepMsg}
            </span>
          </div>
        )}

        {/* Success Confirmation */}
        {lastResult && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'rgba(16, 185, 129, 0.12)',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.82rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} />
              <span>Omni Robo: Design generated & applied to Studio!</span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              Open Studio
            </button>
          </div>
        )}

        {/* Suggestions Title */}
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ 1-Tap Quick Examples:
          </span>
        </div>

        {/* Suggestions Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
          {SUGGESTIONS.map((sug, idx) => (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(sug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <span style={{ fontSize: '1rem' }}>{sug.icon}</span>
                <span style={{ fontSize: '0.8rem', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sug.text}
                </span>
              </div>
              <span style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-muted)',
                flexShrink: 0
              }}>
                {sug.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIStudioPrompt;
