import React, { useRef } from 'react';
import { Palette, Sparkles, Sliders, Layers, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { PRESET_ICONS } from '../utils/presetIcons';

const COLOR_PRESETS = [
  { name: 'Indigo Neon', c1: '#6366f1', c2: '#a855f7', bg: '#ffffff' },
  { name: 'Emerald Pay', c1: '#10b981', c2: '#06b6d4', bg: '#ffffff' },
  { name: 'Crimson Cinema', c1: '#f43f5e', c2: '#a855f7', bg: '#ffffff' },
  { name: 'Electric Cyan', c1: '#06b6d4', c2: '#3b82f6', bg: '#ffffff' },
  { name: 'Amber Glow', c1: '#f59e0b', c2: '#ef4444', bg: '#ffffff' },
  { name: 'Dark Velvet', c1: '#1e1b4b', c2: '#312e81', bg: '#ffffff' }
];

export const CustomizerPanel = ({ customConfig, setCustomConfig }) => {
  const customLogoInputRef = useRef(null);

  const update = (key, val) => {
    setCustomConfig(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleCustomLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update('logo', reader.result);
      update('selectedPresetIcon', 'custom');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="customizer-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Sliders size={18} style={{ color: 'var(--primary-light)' }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Visual Style & Branding</h4>
      </div>

      {/* Pattern Shapes */}
      <div className="form-group">
        <label className="form-label">QR Module Shape</label>
        <div className="customizer-grid">
          {[
            { id: 'rounded', label: 'Rounded' },
            { id: 'dots', label: 'Dots' },
            { id: 'classy', label: 'Classy' },
            { id: 'classy-rounded', label: 'Tech' },
            { id: 'square', label: 'Classic' },
            { id: 'extra-rounded', label: 'Smooth' }
          ].map(shape => (
            <button
              key={shape.id}
              type="button"
              className={`style-chip-btn ${customConfig.dotType === shape.id ? 'active' : ''}`}
              onClick={() => update('dotType', shape.id)}
            >
              <span>{shape.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Eye Shapes */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Corner Frame</label>
          <div className="segmented-control">
            {[
              { id: 'extra-rounded', label: 'Curved' },
              { id: 'square', label: 'Square' },
              { id: 'dot', label: 'Circle' }
            ].map(corner => (
              <button
                key={corner.id}
                type="button"
                className={`seg-btn ${customConfig.cornerSquareType === corner.id ? 'active' : ''}`}
                onClick={() => update('cornerSquareType', corner.id)}
              >
                {corner.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Corner Center Dot</label>
          <div className="segmented-control">
            {[
              { id: 'dot', label: 'Dot' },
              { id: 'square', label: 'Square' }
            ].map(cd => (
              <button
                key={cd.id}
                type="button"
                className={`seg-btn ${customConfig.cornerDotType === cd.id ? 'active' : ''}`}
                onClick={() => update('cornerDotType', cd.id)}
              >
                {cd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Themes */}
      <div className="form-group">
        <label className="form-label">Color Themes & Gradients</label>
        <div className="color-swatch-list">
          {COLOR_PRESETS.map(preset => {
            const isMatch =
              customConfig.gradient?.colorStops?.[0]?.color === preset.c1 &&
              customConfig.gradient?.colorStops?.[1]?.color === preset.c2;
            return (
              <button
                key={preset.name}
                type="button"
                title={preset.name}
                className={`color-swatch ${isMatch ? 'active' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${preset.c1} 0%, ${preset.c2} 100%)`
                }}
                onClick={() => {
                  update('dotColor', preset.c1);
                  update('cornerSquareColor', preset.c1);
                  update('cornerDotColor', preset.c2);
                  update('gradient', {
                    type: 'linear',
                    rotation: 45,
                    colorStops: [
                      { offset: 0, color: preset.c1 },
                      { offset: 1, color: preset.c2 }
                    ]
                  });
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Primary Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="color"
              value={customConfig.gradient?.colorStops?.[0]?.color || customConfig.dotColor || '#6366f1'}
              onChange={(e) => {
                const c1 = e.target.value;
                const c2 = customConfig.gradient?.colorStops?.[1]?.color || '#a855f7';
                update('dotColor', c1);
                update('cornerSquareColor', c1);
                update('gradient', {
                  type: 'linear',
                  rotation: 45,
                  colorStops: [
                    { offset: 0, color: c1 },
                    { offset: 1, color: c2 }
                  ]
                });
              }}
              style={{ width: '42px', height: '42px', padding: '2px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              {customConfig.gradient?.colorStops?.[0]?.color || customConfig.dotColor}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Secondary (Gradient)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="color"
              value={customConfig.gradient?.colorStops?.[1]?.color || '#a855f7'}
              onChange={(e) => {
                const c2 = e.target.value;
                const c1 = customConfig.gradient?.colorStops?.[0]?.color || '#6366f1';
                update('cornerDotColor', c2);
                update('gradient', {
                  type: 'linear',
                  rotation: 45,
                  colorStops: [
                    { offset: 0, color: c1 },
                    { offset: 1, color: c2 }
                  ]
                });
              }}
              style={{ width: '42px', height: '42px', padding: '2px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              {customConfig.gradient?.colorStops?.[1]?.color || '#a855f7'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Icon & Branding Logo */}
      <div className="form-group">
        <label className="form-label">Center Logo / Icon</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {PRESET_ICONS.map(item => (
            <button
              key={item.id}
              type="button"
              className={`style-chip-btn ${customConfig.selectedPresetIcon === item.id ? 'active' : ''}`}
              style={{ minWidth: '58px', padding: '6px 8px' }}
              onClick={() => {
                update('selectedPresetIcon', item.id);
                update('logo', item.iconUrl);
              }}
            >
              {item.iconUrl ? (
                <img src={item.iconUrl} alt={item.name} style={{ width: '20px', height: '20px' }} />
              ) : (
                <span style={{ fontSize: '0.72rem' }}>None</span>
              )}
              <span style={{ fontSize: '0.7rem' }}>{item.name}</span>
            </button>
          ))}

          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '8px 12px' }}
            onClick={() => customLogoInputRef.current?.click()}
          >
            <Upload size={14} />
            <span>Upload Logo</span>
          </button>
          <input
            ref={customLogoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleCustomLogoUpload}
          />
        </div>
      </div>

      {/* Frame Badge Label */}
      <div className="form-group">
        <label className="form-label">Printable Card Frame Label</label>
        <input
          type="text"
          placeholder="e.g. SCAN TO WATCH, SCAN TO PAY"
          value={customConfig.frameLabel || ''}
          onChange={(e) => update('frameLabel', e.target.value)}
        />
      </div>
    </div>
  );
};
