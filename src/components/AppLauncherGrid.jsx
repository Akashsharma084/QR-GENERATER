import React from 'react';
import { 
  CreditCard, Film, Music, Image as ImageIcon, FileText, UserPlus, 
  ChevronRight, Sparkles
} from 'lucide-react';
import { RoboLogo } from './common/RoboLogo';

const APP_FEATURES = [
  {
    id: 'ai',
    title: 'AI Robo Chatbot',
    shortName: 'Robo AI',
    subtitle: 'Chat with Omni Robo. Paste any link, text, UPI, song or file to convert it into a smart QR code.',
    tag: '🤖 Conversational Chatbot',
    accentColor: '#c084fc',
    bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(236, 72, 153, 0.18) 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(192, 132, 252, 0.6), rgba(236, 72, 153, 0.6))',
    icon: <RoboLogo size={36} />,
    isHero: true,
    badgeText: 'AI CHATBOT',
    badgeClass: 'badge-ai'
  },
  {
    id: 'payment',
    title: 'UPI & Instant Pay',
    shortName: 'Payments',
    subtitle: 'Direct camera scan for GPay, PhonePe, Paytm with instant UPI payment and interactive receipt bills.',
    tag: 'GPay • PhonePe • Paytm',
    accentColor: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.14) 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(6, 182, 212, 0.4))',
    icon: <CreditCard size={30} style={{ color: '#34d399' }} />,
    badgeText: '0% Fees • Direct UPI',
    badgeClass: 'badge-payment'
  },
  {
    id: 'movie',
    title: 'Movie & Video Cinema',
    shortName: 'Cinema',
    subtitle: 'Stream YouTube trailers or MP4 video clips with full-bleed posters, director credits & synopsis.',
    tag: 'Trailers • Stream • Posters',
    accentColor: '#f43f5e',
    bgGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.14) 0%, rgba(168, 85, 247, 0.14) 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.4), rgba(168, 85, 247, 0.4))',
    icon: <Film size={30} style={{ color: '#fb7185' }} />,
    badgeText: '4K Cinema View',
    badgeClass: 'badge-movie'
  },
  {
    id: 'music',
    title: 'Music & Audio Player',
    shortName: 'Music',
    subtitle: 'Interactive audio player with vinyl disc animation, album artwork, MP3 upload & synced lyrics.',
    tag: 'Songs • Disc • Synced Lyrics',
    accentColor: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(236, 72, 153, 0.14) 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4))',
    icon: <Music size={30} style={{ color: '#a78bfa' }} />,
    badgeText: 'Lossless Audio',
    badgeClass: 'badge-music'
  },
  {
    id: 'image',
    title: 'Photo & Art Gallery',
    shortName: 'Gallery',
    subtitle: 'Full-bleed photo showcase with camera metadata, photographer credits, description & instant download.',
    tag: 'Ultra HD • Portfolios • Photos',
    accentColor: '#0ea5e9',
    bgGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.14) 0%, rgba(99, 102, 241, 0.14) 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(99, 102, 241, 0.4))',
    icon: <ImageIcon size={30} style={{ color: '#38bdf8' }} />,
    badgeText: 'Ultra HD Photos',
    badgeClass: 'badge-image'
  },
  {
    id: 'document',
    title: 'Smart PDF & Documents',
    shortName: 'Documents',
    subtitle: 'Cloud document viewer for resumes, restaurant menus, product catalogs, brochures & invoices.',
    tag: 'Cloud PDF • Invoices • Menus',
    accentColor: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(239, 68, 68, 0.14) 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(239, 68, 68, 0.4))',
    icon: <FileText size={30} style={{ color: '#fbbf24' }} />,
    badgeText: 'Cloud PDF Viewer',
    badgeClass: 'badge-doc'
  },
  {
    id: 'info',
    title: 'vCard, WiFi & Links',
    shortName: 'Connect',
    subtitle: '1-Tap contact address book save, password-free 5G WiFi login, notes & high-speed URL redirection.',
    tag: 'Digital vCard • 5G WiFi • Web',
    accentColor: '#6366f1',
    bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.14) 100%)',
    borderGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4))',
    icon: <UserPlus size={30} style={{ color: '#818cf8' }} />,
    badgeText: '1-Tap Universal',
    badgeClass: 'badge-info'
  }
];

export const AppLauncherGrid = ({ onSelectApp, onOpenAI }) => {
  return (
    <div className="app-launcher-wrapper">
      {/* App Hub Header - Clean, without previous draft nav */}
      <div className="app-hub-hero">
        <div className="app-hub-header-badge">
          <span className="live-pulse-dot" />
          <span>OmniQR Feature Hub</span>
        </div>
        <h1 className="app-hub-title">
          Choose a Feature <span className="gradient-text">App to Create</span>
        </h1>
        <p className="app-hub-subtitle">
          Select any feature box below to generate and customize your interactive smart QR code.
        </p>
      </div>

      {/* App Boxes Grid */}
      <div className="app-cards-grid">
        {APP_FEATURES.map((app) => {
          const isAI = app.id === 'ai';

          return (
            <div
              key={app.id}
              className={`app-feature-box ${isAI ? 'hero-box' : ''}`}
              style={{
                '--box-accent': app.accentColor,
                '--box-bg': app.bgGradient,
                '--box-border': app.borderGradient
              }}
              onClick={() => {
                if (isAI) {
                  onOpenAI();
                } else {
                  onSelectApp(app.id);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (isAI) onOpenAI();
                  else onSelectApp(app.id);
                }
              }}
            >
              {/* Top Row: Icon + Badge */}
              <div className="app-box-top">
                <div className={`app-box-icon-container ${isAI ? 'ai-icon-pulse' : ''}`}>
                  {app.icon}
                </div>
                <div className={`app-box-badge ${app.badgeClass}`}>
                  {app.badgeText}
                </div>
              </div>

              {/* Middle: Title & Subtitle */}
              <div className="app-box-content">
                <div className="app-box-title-row">
                  <h3 className="app-box-title">{app.title}</h3>
                  {isAI && (
                    <span className="robo-tag-pill">
                      <Sparkles size={11} />
                      CHATBOT
                    </span>
                  )}
                </div>
                <p className="app-box-subtitle">{app.subtitle}</p>
              </div>

              {/* Bottom Row: Tag & Action CTA */}
              <div className="app-box-footer">
                <span className="app-box-tag">{app.tag}</span>
                <div className="app-box-action-btn">
                  <span>{isAI ? 'Open Chatbot' : 'Open App'}</span>
                  <ChevronRight size={15} />
                </div>
              </div>

              {/* Ambient Glow in background */}
              <div className="app-box-glow" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppLauncherGrid;
