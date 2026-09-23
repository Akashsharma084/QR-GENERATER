import React from 'react';
import { UserPlus, Wifi, FileText, Globe } from 'lucide-react';

export const InfoForm = ({ formData, setFormData }) => {
  const subType = formData.infoType || 'vcard';

  const update = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <label className="form-label">Info Category</label>
        <div className="segmented-control">
          <button
            type="button"
            className={`seg-btn ${subType === 'vcard' ? 'active' : ''}`}
            onClick={() => update('infoType', 'vcard')}
          >
            <UserPlus size={14} style={{ display: 'inline', marginRight: '6px' }} />
            vCard Contact
          </button>
          <button
            type="button"
            className={`seg-btn ${subType === 'wifi' ? 'active' : ''}`}
            onClick={() => update('infoType', 'wifi')}
          >
            <Wifi size={14} style={{ display: 'inline', marginRight: '6px' }} />
            WiFi Connect
          </button>
          <button
            type="button"
            className={`seg-btn ${subType === 'text' ? 'active' : ''}`}
            onClick={() => update('infoType', 'text')}
          >
            <FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Formatted Text
          </button>
          <button
            type="button"
            className={`seg-btn ${subType === 'url' ? 'active' : ''}`}
            onClick={() => update('infoType', 'url')}
          >
            <Globe size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Web Link
          </button>
        </div>
      </div>

      {subType === 'vcard' && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                placeholder="e.g. Sarah"
                value={formData.firstName || ''}
                onChange={(e) => update('firstName', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                placeholder="e.g. Jenkins"
                value={formData.lastName || ''}
                onChange={(e) => update('lastName', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone || ''}
                onChange={(e) => update('phone', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="sarah@example.com"
                value={formData.email || ''}
                onChange={(e) => update('email', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company / Organization</label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={formData.organization || ''}
                onChange={(e) => update('organization', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                placeholder="Product Designer"
                value={formData.jobTitle || ''}
                onChange={(e) => update('jobTitle', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Website or Portfolio Link</label>
            <input
              type="url"
              placeholder="https://sarahjenkins.design"
              value={formData.website || ''}
              onChange={(e) => update('website', e.target.value)}
            />
          </div>
        </>
      )}

      {subType === 'wifi' && (
        <>
          <div className="form-group">
            <label className="form-label">Network Name (SSID) *</label>
            <input
              type="text"
              placeholder="e.g. Office_HighSpeed_5G"
              value={formData.wifiSsid || ''}
              onChange={(e) => update('wifiSsid', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1.5 }}>
              <label className="form-label">WiFi Password</label>
              <input
                type="text"
                placeholder="Leave blank for open networks"
                value={formData.wifiPassword || ''}
                onChange={(e) => update('wifiPassword', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Security Protocol</label>
              <select
                value={formData.wifiEncryption || 'WPA'}
                onChange={(e) => update('wifiEncryption', e.target.value)}
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>
          </div>
        </>
      )}

      {subType === 'text' && (
        <>
          <div className="form-group">
            <label className="form-label">Note Title</label>
            <input
              type="text"
              placeholder="e.g. Event Agenda, Welcome Note, Instructions"
              value={formData.textTitle || ''}
              onChange={(e) => update('textTitle', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message / Content *</label>
            <textarea
              rows={4}
              placeholder="Type any message, instructions, code snippet, or announcement..."
              value={formData.textContent || ''}
              onChange={(e) => update('textContent', e.target.value)}
              required
            />
          </div>
        </>
      )}

      {subType === 'url' && (
        <div className="form-group">
          <label className="form-label">Destination Web Link *</label>
          <input
            type="url"
            placeholder="https://example.com/special-page"
            value={formData.urlLink || ''}
            onChange={(e) => update('urlLink', e.target.value)}
            required
          />
          <span className="form-hint">Users scanning directly open this URL in their browser</span>
        </div>
      )}
    </div>
  );
};
