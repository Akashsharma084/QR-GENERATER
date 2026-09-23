import React from 'react';

/**
 * High-Tech Robot Logo & Mascot for AI Mode
 * Features glowing visor eyes, futuristic antenna with ping pulse, and cybernetic ear nodes.
 */
export const RoboLogo = ({ size = 24, animated = true, glow = true, className = '' }) => {
  return (
    <div
      className={`robo-logo-container ${animated ? 'robo-animated' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}
      title="Omni Robo AI"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: glow ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.65)) drop-shadow(0 0 16px rgba(236, 72, 153, 0.35))' : 'none',
          overflow: 'visible'
        }}
      >
        <defs>
          <linearGradient id="roboBodyGrad" x1="4" y1="12" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="roboVisorGrad" x1="12" y1="20" x2="36" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="roboEyeGrad" x1="14" y1="23" x2="34" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Antenna Stem */}
        <line x1="24" y1="12" x2="24" y2="6" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Antenna Bulb / Transmitter */}
        <circle cx="24" cy="5" r="3" fill="#f472b6" className="robo-antenna-bulb" />
        {/* Antenna Ping Wave */}
        <circle cx="24" cy="5" r="5" stroke="#f472b6" strokeWidth="1" opacity="0.6" className="robo-antenna-ring" />

        {/* Left Ear Node */}
        <rect x="5" y="21" width="4" height="10" rx="2" fill="#7e22ce" stroke="#c084fc" strokeWidth="1.2" />
        {/* Right Ear Node */}
        <rect x="39" y="21" width="4" height="10" rx="2" fill="#7e22ce" stroke="#c084fc" strokeWidth="1.2" />

        {/* Robot Head Shape */}
        <rect
          x="8"
          y="12"
          width="32"
          height="28"
          rx="9"
          fill="url(#roboBodyGrad)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />

        {/* Visor Area (Face Screen) */}
        <rect
          x="12"
          y="18"
          width="24"
          height="14"
          rx="5"
          fill="url(#roboVisorGrad)"
          stroke="#a855f7"
          strokeWidth="1"
        />

        {/* Visor Digital Scan Line */}
        <line x1="13" y1="25" x2="35" y2="25" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Left Glowing Eye */}
        <ellipse cx="18" cy="25" rx="3" ry="3.5" fill="url(#roboEyeGrad)" filter="url(#eyeGlow)" className="robo-eye-left" />
        {/* Right Glowing Eye */}
        <ellipse cx="30" cy="25" rx="3" ry="3.5" fill="url(#roboEyeGrad)" filter="url(#eyeGlow)" className="robo-eye-right" />

        {/* Eye Specular Highlights */}
        <circle cx="17.2" cy="23.8" r="0.8" fill="#ffffff" />
        <circle cx="29.2" cy="23.8" r="0.8" fill="#ffffff" />

        {/* Cute Cheek Blush / Micro LEDs */}
        <circle cx="15" cy="30" r="1" fill="#ec4899" opacity="0.7" />
        <circle cx="33" cy="30" r="1" fill="#ec4899" opacity="0.7" />

        {/* Chin Sensor Grid */}
        <line x1="20" y1="36" x2="28" y2="36" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="38" x2="26" y2="38" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default RoboLogo;
