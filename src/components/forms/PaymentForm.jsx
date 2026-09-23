import React from 'react';
import { DollarSign, CreditCard, Wallet, IndianRupee, Bitcoin, Globe, Info, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const PaymentForm = ({ formData, setFormData }) => {
  const method = formData.paymentMethod || 'upi';
  const paymentMode = formData.paymentMode || 'direct'; // 'direct' | 'landing'

  const update = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  return (
    <div className="form-container">
      {/* Payment Scan Mode (Direct UPI App Scan vs Web Landing Page) */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={15} style={{ color: '#34d399' }} />
          <span>QR Scan Action Mode</span>
        </label>
        <div className="segmented-control" style={{ padding: '5px' }}>
          <button
            type="button"
            className={`seg-btn ${paymentMode === 'direct' ? 'active' : ''}`}
            onClick={() => update('paymentMode', 'direct')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 8px' }}
          >
            <Zap size={14} style={{ color: paymentMode === 'direct' ? '#34d399' : 'inherit' }} />
            <span style={{ fontWeight: 700 }}>Direct UPI Scan (Recommended)</span>
          </button>
          <button
            type="button"
            className={`seg-btn ${paymentMode === 'landing' ? 'active' : ''}`}
            onClick={() => update('paymentMode', 'landing')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 8px' }}
          >
            <Sparkles size={14} style={{ color: paymentMode === 'landing' ? '#818cf8' : 'inherit' }} />
            <span style={{ fontWeight: 700 }}>Web Checkout Card</span>
          </button>
        </div>

        <div style={{
          marginTop: '8px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: paymentMode === 'direct' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.08)',
          border: `1px solid ${paymentMode === 'direct' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: '1.4'
        }}>
          {paymentMode === 'direct' ? (
            <span>
              ⚡ <strong>Direct App Scan:</strong> Customers can scan this QR directly from inside <strong>Google Pay, PhonePe, Paytm, or BHIM camera scanner</strong>. Payment opens instantly in their app without opening the browser!
            </span>
          ) : (
            <span>
              ✨ <strong>Web Checkout Card:</strong> Scanners open a branded mobile landing page showing your business name, invoice notes, and 1-tap buttons to pay.
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Payment Gateway / Platform</label>
        <div className="segmented-control" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`seg-btn ${method === 'upi' ? 'active' : ''}`}
            onClick={() => update('paymentMethod', 'upi')}
          >
            UPI (GPay/PhonePe)
          </button>
          <button
            type="button"
            className={`seg-btn ${method === 'paypal' ? 'active' : ''}`}
            onClick={() => update('paymentMethod', 'paypal')}
          >
            PayPal.me
          </button>
          <button
            type="button"
            className={`seg-btn ${method === 'stripe' ? 'active' : ''}`}
            onClick={() => update('paymentMethod', 'stripe')}
          >
            Stripe Link
          </button>
          <button
            type="button"
            className={`seg-btn ${method === 'crypto' ? 'active' : ''}`}
            onClick={() => update('paymentMethod', 'crypto')}
          >
            Crypto
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Payee / Business Name *</label>
          <input
            type="text"
            placeholder="e.g. Alex Studio, Acme Coffee"
            value={formData.payeeName || ''}
            onChange={(e) => update('payeeName', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            value={formData.currency || 'INR'}
            onChange={(e) => update('currency', e.target.value)}
          >
            <option value="INR">INR (₹ - Indian Rupee)</option>
            <option value="USD">USD ($ - US Dollar)</option>
            <option value="EUR">EUR (€ - Euro)</option>
            <option value="GBP">GBP (£ - British Pound)</option>
            <option value="CAD">CAD ($ - Canadian Dollar)</option>
            <option value="AUD">AUD ($ - Australian Dollar)</option>
            <option value="JPY">JPY (¥ - Japanese Yen)</option>
            <option value="AED">AED (د.إ - UAE Dirham)</option>
          </select>
        </div>
      </div>

      {method === 'upi' && (
        <div className="form-group">
          <label className="form-label">UPI ID / VPA *</label>
          <input
            type="text"
            placeholder="e.g. username@okhdfcbank or 9876543210@paytm"
            value={formData.upiId || ''}
            onChange={(e) => update('upiId', e.target.value)}
          />
          <span className="form-hint">Format: yourhandle@bank or mobile@paytm</span>
        </div>
      )}

      {method === 'paypal' && (
        <div className="form-group">
          <label className="form-label">PayPal.me Username *</label>
          <input
            type="text"
            placeholder="e.g. yourname or company"
            value={formData.paypalHandle || ''}
            onChange={(e) => update('paypalHandle', e.target.value)}
          />
        </div>
      )}

      {method === 'stripe' && (
        <div className="form-group">
          <label className="form-label">Stripe Payment Link *</label>
          <input
            type="url"
            placeholder="https://buy.stripe.com/..."
            value={formData.stripeLink || ''}
            onChange={(e) => update('stripeLink', e.target.value)}
          />
        </div>
      )}

      {method === 'crypto' && (
        <div className="form-row">
          <div className="form-group" style={{ flex: '0 0 100px' }}>
            <label className="form-label">Coin</label>
            <select
              value={formData.cryptoType || 'BTC'}
              onChange={(e) => update('cryptoType', e.target.value)}
            >
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
              <option value="SOL">SOL</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Wallet Address *</label>
            <input
              type="text"
              placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              value={formData.cryptoAddress || ''}
              onChange={(e) => update('cryptoAddress', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            <span>Requested Amount</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>(Optional)</span>
          </label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 250 (Leave blank for payer's choice)"
            value={formData.amount || ''}
            onChange={(e) => update('amount', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Note / Purpose</label>
          <input
            type="text"
            placeholder="e.g. Chai & Snacks, Invoice #20"
            value={formData.paymentNote || ''}
            onChange={(e) => update('paymentNote', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
