import React from 'react';
import { motion } from 'motion/react';

interface HippoMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  animate?: boolean;
}

export const HippoMascot: React.FC<HippoMascotProps> = ({
  size = 'md',
  className = '',
  animate = true
}) => {
  const dimensions = {
    sm: { width: 56, height: 56 },
    md: { width: 110, height: 110 },
    lg: { width: 180, height: 180 },
    hero: { width: 260, height: 260 }
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Ambient Gold Halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#F3E5AB]/30 to-transparent blur-xl pointer-events-none" />

      {/* Animated Orbital Golden Ring */}
      {animate && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-12%] rounded-full border border-dashed border-[#C5A059]/40 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]" />
          <div className="absolute bottom-1/4 right-0 w-1.5 h-1.5 rounded-full bg-[#E6CA65] shadow-[0_0_6px_#E6CA65]" />
        </motion.div>
      )}

      {/* Floating Gentle Mascot Container */}
      <motion.div
        animate={animate ? { y: [-4, 5, -4], rotate: [-0.5, 0.5, -0.5] } : {}}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(197,160,89,0.22)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Gold Gradient */}
            <linearGradient id="hippoGold" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFF1B8" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#AA822A" />
              <stop offset="100%" stopColor="#785516" />
            </linearGradient>

            {/* Ceramic Porcelain Body Gradient */}
            <linearGradient id="hippoPorcelain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F9F6EE" />
              <stop offset="100%" stopColor="#E9E2D2" />
            </linearGradient>

            {/* Muzzle Gradient */}
            <linearGradient id="hippoMuzzle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F4EFE6" />
              <stop offset="100%" stopColor="#DFD6C2" />
            </linearGradient>

            {/* Eye Visor Gradient */}
            <linearGradient id="hippoVisor" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E1E1C" />
              <stop offset="50%" stopColor="#2F2C25" />
              <stop offset="100%" stopColor="#1E1E1C" />
            </linearGradient>

            {/* Globe Sphere Gradient */}
            <radialGradient id="globeGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="45%" stopColor="#F0DC9C" />
              <stop offset="85%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C6819" />
            </radialGradient>
          </defs>

          {/* Background Holographic Globe Ring */}
          <ellipse cx="100" cy="108" rx="88" ry="34" stroke="url(#hippoGold)" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.75" />
          <ellipse cx="100" cy="108" rx="88" ry="34" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />

          {/* Ears */}
          <circle cx="62" cy="52" r="14" fill="url(#hippoPorcelain)" stroke="#E5DAC5" strokeWidth="1.5" />
          <circle cx="62" cy="52" r="8" fill="url(#hippoGold)" opacity="0.85" />
          <circle cx="138" cy="52" r="14" fill="url(#hippoPorcelain)" stroke="#E5DAC5" strokeWidth="1.5" />
          <circle cx="138" cy="52" r="8" fill="url(#hippoGold)" opacity="0.85" />

          {/* Main Hippo Head Sculpt */}
          <ellipse cx="100" cy="85" rx="46" ry="40" fill="url(#hippoPorcelain)" stroke="#E0D7C4" strokeWidth="1.5" />

          {/* Golden AI Intelligence Crown Nodes / Antenna */}
          <path d="M96 46 L100 36 L104 46 Z" fill="url(#hippoGold)" />
          <circle cx="100" cy="34" r="4" fill="#FFF2BF" stroke="#B89035" strokeWidth="1.5" />

          {/* Sleek Friendly Eyes / Visor */}
          <rect x="74" y="70" width="52" height="16" rx="8" fill="url(#hippoVisor)" />
          {/* Eye glow points */}
          <circle cx="86" cy="78" r="4.5" fill="#D4AF37" />
          <circle cx="88" cy="76" r="1.5" fill="#FFFFFF" />
          <circle cx="114" cy="78" r="4.5" fill="#D4AF37" />
          <circle cx="116" cy="76" r="1.5" fill="#FFFFFF" />

          {/* Iconic Hippo Wide Muzzle */}
          <ellipse cx="100" cy="112" rx="44" ry="30" fill="url(#hippoMuzzle)" stroke="#D8CDB6" strokeWidth="1.5" />

          {/* Nostrils */}
          <ellipse cx="86" cy="105" rx="4.5" ry="7" fill="url(#hippoGold)" opacity="0.9" />
          <ellipse cx="114" cy="105" rx="4.5" ry="7" fill="url(#hippoGold)" opacity="0.9" />

          {/* Warm Friendly Smile */}
          <path d="M88 124 Q100 134 112 124" stroke="#7A5A19" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Golden Collar Badge with HippoX 'X' */}
          <path d="M82 144 C88 148 112 148 118 144 L114 154 C108 158 92 158 86 154 Z" fill="url(#hippoGold)" />
          <text x="96" y="152" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">X</text>

          {/* Miniature Floating Polyglot Hologram Orb */}
          <g transform="translate(142, 108)">
            <circle cx="16" cy="16" r="14" fill="url(#globeGrad)" />
            {/* Globe Lat/Long lines */}
            <circle cx="16" cy="16" r="14" stroke="#FFF" strokeWidth="0.8" opacity="0.4" fill="none" />
            <ellipse cx="16" cy="16" rx="14" ry="5" stroke="#FFF" strokeWidth="0.8" opacity="0.5" fill="none" />
            <line x1="16" y1="2" x2="16" y2="30" stroke="#FFF" strokeWidth="0.8" opacity="0.5" />
            {/* Shimmer light */}
            <circle cx="12" cy="11" r="3" fill="#FFF" opacity="0.7" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
