import React, { useState } from 'react';
import { Sparkles, Wand2, X, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { parseAIPrompt } from '../../utils/aiPromptParser';

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

    // Dynamic AI synthesis steps for rich aesthetic feel
    setStepMsg('Analyzing natural language intent...');
    await new Promise(r => setTimeout(r, 350));

    setStepMsg('Extracting content tokens, amounts & handles...');
    await new Promise(r => setTimeout(r, 400));

    setStepMsg('Synthesizing color gradients & module geometry...');
    const result = parseAIPrompt(text);
    await new Promise(r => setTimeout(r, 350));

    setStepMsg('Applying QR branding & presets...');
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
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.95), rgba(9, 9, 11, 0.98))',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        boxShadow: '0 24px 60px rgba(168, 85, 247, 0.25), 0 0 40px rgba(0,0,0,0.8)',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow ambient background circle */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 16px rgba(168, 85, 247, 0.5)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>OmniQR Magic AI</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}>
                  PROMPT MODE
                </span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Describe in Hinglish or English what QR you want. AI will build it instantly!
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

        {/* Prompt Input Box */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <textarea
            rows={3}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type your prompt here... (e.g. 'Coffee shop ke liye ₹150 UPI QR banao emerald theme me' ya 'Instagram creator hub for @alex_design in neon purple')"
            style={{
              width: '100%',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#fff',
              padding: '14px',
              fontSize: '0.9rem',
              resize: 'none',
              outline: 'none',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
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
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)',
              fontSize: '0.9rem',
              padding: '12px'
            }}
          >
            <Wand2 size={16} />
            <span>{isGenerating ? (stepMsg || 'Generating with AI...') : 'Generate with Magic AI'}</span>
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
            marginBottom: '16px'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(168,85,247,0.3)',
              borderTopColor: '#c084fc',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 500 }}>
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
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.82rem' }}>
              <CheckCircle2 size={16} />
              <span>{lastResult.summary}</span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}

        {/* Sample Prompt Chips */}
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} style={{ color: '#eab308' }} />
            <span>Try these 1-tap example prompts:</span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-suggestion-chip"
                onClick={() => handleSuggestionClick(sug)}
                disabled={isGenerating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{sug.icon}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sug.text}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  flexShrink: 0
                }}>
                  {sug.tag}
                </span>
                <ArrowRight size={12} style={{ opacity: 0.5 }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
