import React from 'react';

/**
 * Minecraft-themed Pixel Art SVGs for 8-year-old learners.
 * 100% inline SVG, highly optimized and crisp.
 */

// Minecraft Pig (Cute mob for Level 1)
export const MinecraftPig: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block ${className}`} style={{ imageRendering: 'pixelated' }}>
    {/* Head Base */}
    <rect x="1" y="2" width="14" height="12" fill="#F48FB1" stroke="#C2185B" strokeWidth="0.5" />
    <rect x="2" y="3" width="12" height="10" fill="#F06292" />
    {/* Eyes */}
    <rect x="2" y="6" width="3" height="2" fill="#FFFFFF" />
    <rect x="3" y="6" width="2" height="2" fill="#000000" />
    <rect x="11" y="6" width="3" height="2" fill="#FFFFFF" />
    <rect x="11" y="6" width="2" height="2" fill="#000000" />
    {/* Snout */}
    <rect x="5" y="8" width="6" height="4" fill="#E91E63" />
    <rect x="6" y="9" width="1.5" height="2" fill="#880E4F" />
    <rect x="8.5" y="9" width="1.5" height="2" fill="#880E4F" />
  </svg>
);

// Minecraft Sheep (Level 1)
export const MinecraftSheep: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block ${className}`} style={{ imageRendering: 'pixelated' }}>
    {/* Wool Body */}
    <rect x="1" y="2" width="14" height="12" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="0.5" />
    {/* Face */}
    <rect x="5" y="4" width="6" height="7" fill="#FFCCBC" />
    {/* Eyes */}
    <rect x="4" y="6" width="2" height="2" fill="#FFFFFF" />
    <rect x="5" y="6" width="1" height="2" fill="#3E2723" />
    <rect x="10" y="6" width="2" height="2" fill="#FFFFFF" />
    <rect x="10" y="6" width="1" height="2" fill="#3E2723" />
    {/* Pink nose */}
    <rect x="7" y="9" width="2" height="1" fill="#E57373" />
  </svg>
);

// Minecraft Wolf / Dog (Level 1)
export const MinecraftWolf: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block ${className}`} style={{ imageRendering: 'pixelated' }}>
    {/* Ears */}
    <rect x="3" y="1" width="3" height="3" fill="#BDBDBD" />
    <rect x="10" y="1" width="3" height="3" fill="#BDBDBD" />
    {/* Head */}
    <rect x="3" y="3" width="10" height="9" fill="#E0E0E0" stroke="#757575" strokeWidth="0.5" />
    {/* Red Collar */}
    <rect x="4" y="12" width="8" height="2" fill="#D32F2F" />
    {/* Eyes */}
    <rect x="4" y="5" width="2" height="2" fill="#FFFFFF" />
    <rect x="5" y="5" width="1" height="2" fill="#212121" />
    <rect x="10" y="5" width="2" height="2" fill="#FFFFFF" />
    <rect x="10" y="5" width="1" height="2" fill="#212121" />
    {/* Snout */}
    <rect x="6" y="8" width="4" height="3" fill="#BDBDBD" />
    <rect x="7" y="8" width="2" height="1.5" fill="#212121" />
  </svg>
);

// Minecraft Creeper (Level 3 - Hidden / Radar)
export const MinecraftCreeper: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block filter drop-shadow-[0_0_6px_rgba(34,197,94,0.6)] ${className}`} style={{ imageRendering: 'pixelated' }}>
    {/* Green Pixel Face */}
    <rect x="1" y="1" width="14" height="14" fill="#388E3C" stroke="#1B5E20" strokeWidth="0.5" />
    <rect x="2" y="2" width="12" height="12" fill="#4CAF50" />
    <rect x="4" y="3" width="2" height="2" fill="#2E7D32" />
    <rect x="10" y="3" width="2" height="2" fill="#66BB6A" />
    <rect x="3" y="11" width="3" height="2" fill="#2E7D32" />
    <rect x="10" y="10" width="3" height="2" fill="#1B5E20" />
    {/* Iconic Creeper Face Cavities */}
    {/* Eyes */}
    <rect x="3" y="4" width="3" height="3" fill="#000000" />
    <rect x="10" y="4" width="3" height="3" fill="#000000" />
    {/* Center nose bridge */}
    <rect x="7" y="7" width="2" height="3" fill="#000000" />
    {/* Mouth */}
    <rect x="5" y="8" width="6" height="4" fill="#000000" />
    <rect x="5" y="12" width="2" height="2" fill="#000000" />
    <rect x="9" y="12" width="2" height="2" fill="#000000" />
  </svg>
);

// Minecraft Enderman (Level 2 - Side View / Height)
export const MinecraftEnderman: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 24" className={`inline-block filter drop-shadow-[0_0_8px_rgba(168,85,247,0.9)] ${className}`} style={{ imageRendering: 'pixelated' }}>
    {/* Body / Head */}
    <rect x="4" y="1" width="8" height="8" fill="#121212" stroke="#000000" strokeWidth="0.5" />
    {/* Glowing Purple Eyes */}
    <rect x="4" y="4" width="3" height="1.5" fill="#E040FB" />
    <rect x="5" y="4" width="1" height="1.5" fill="#FFFFFF" />
    <rect x="9" y="4" width="3" height="1.5" fill="#E040FB" />
    <rect x="10" y="4" width="1" height="1.5" fill="#FFFFFF" />
    {/* Slender Torso */}
    <rect x="6" y="9" width="4" height="6" fill="#121212" />
    {/* Slender Long Legs */}
    <rect x="6" y="15" width="1.5" height="9" fill="#121212" />
    <rect x="8.5" y="15" width="1.5" height="9" fill="#121212" />
    {/* Purple magical particles */}
    <circle cx="2" cy="7" r="1" fill="#C084FC" opacity="0.8">
      <animate attributeName="cy" values="7;3;7" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="14" cy="12" r="1" fill="#C084FC" opacity="0.8">
      <animate attributeName="cy" values="12;8;12" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// Minecraft Diamond Ore Block
export const DiamondOre: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block ${className}`} style={{ imageRendering: 'pixelated' }}>
    {/* Stone Base */}
    <rect x="0" y="0" width="16" height="16" fill="#757575" stroke="#424242" strokeWidth="0.5" />
    <rect x="1" y="1" width="14" height="14" fill="#616161" />
    <rect x="3" y="2" width="2" height="2" fill="#424242" />
    <rect x="11" y="9" width="3" height="2" fill="#424242" />
    {/* Diamond Gems glowing */}
    <rect x="3" y="4" width="3" height="3" fill="#00E5FF" />
    <rect x="4" y="5" width="1" height="1" fill="#FFFFFF" />
    <rect x="9" y="3" width="2" height="2" fill="#00E5FF" />
    <rect x="10" y="7" width="3" height="3" fill="#00E5FF" />
    <rect x="11" y="8" width="1" height="1" fill="#FFFFFF" />
    <rect x="4" y="10" width="3" height="3" fill="#00E5FF" />
  </svg>
);

// Minecraft Compass
export const MinecraftCompass: React.FC<{ size?: number; angle?: number; className?: string }> = ({ size = 32, angle = 0, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block ${className}`} style={{ imageRendering: 'pixelated' }}>
    {/* Iron Frame */}
    <rect x="2" y="2" width="12" height="12" rx="3" fill="#546E7A" stroke="#263238" strokeWidth="0.5" />
    <rect x="3" y="3" width="10" height="10" rx="2" fill="#212121" />
    {/* Compass Needle with rotation */}
    <g transform={`rotate(${angle} 8 8)`}>
      <polygon points="8,4 6,8 8,7 10,8" fill="#F44336" />
      <polygon points="8,12 6,8 8,9 10,8" fill="#ECEFF1" />
      <circle cx="8" cy="8" r="1" fill="#FFD54F" />
    </g>
  </svg>
);

// Minecraft Snowball (Projectile for Level 1)
export const SnowballIcon: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block ${className}`}>
    <rect x="4" y="2" width="8" height="12" fill="#ECEFF1" />
    <rect x="2" y="4" width="12" height="8" fill="#ECEFF1" />
    <rect x="4" y="4" width="8" height="8" fill="#FFFFFF" />
    <rect x="5" y="5" width="3" height="3" fill="#B0BEC5" />
    <rect x="9" y="8" width="2" height="2" fill="#CFD8DC" />
  </svg>
);

// Crosshair Marker for Miss
export const CrosshairMarker: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={`inline-block ${className}`}>
    <line x1="8" y1="1" x2="8" y2="5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="square" />
    <line x1="8" y1="11" x2="8" y2="15" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="square" />
    <line x1="1" y1="8" x2="5" y2="8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="square" />
    <line x1="11" y1="8" x2="15" y2="8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="square" />
    <rect x="7" y="7" width="2" height="2" fill="#DC2626" />
  </svg>
);

// Minecraft Hearts Display
export const MinecraftHearts: React.FC<{ heartsCount: number; maxHearts?: number }> = ({ heartsCount, maxHearts = 6 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: maxHearts }).map((_, i) => {
      const isFilled = i < heartsCount;
      return (
        <svg key={i} width="18" height="18" viewBox="0 0 16 16" className="inline-block" style={{ imageRendering: 'pixelated' }}>
          {/* Heart frame */}
          <path
            d="M3 2 H6 V4 H7 V5 H9 V4 H10 V2 H13 V5 H14 V8 H13 V10 H11 V12 H9 V14 H7 V12 H5 V10 H3 V8 H2 V5 H3 Z"
            fill="#212121"
          />
          {/* Filled interior */}
          {isFilled ? (
            <path
              d="M4 3 H6 V5 H7 V6 H9 V5 H10 V3 H12 V6 H13 V8 H12 V10 H10 V12 H9 V13 H7 V12 H6 V10 H4 V8 H3 V6 H4 Z"
              fill="#E53935"
            />
          ) : (
            <path
              d="M4 3 H6 V5 H7 V6 H9 V5 H10 V3 H12 V6 H13 V8 H12 V10 H10 V12 H9 V13 H7 V12 H6 V10 H4 V8 H3 V6 H4 Z"
              fill="#424242"
            />
          )}
          {/* Highlight shine */}
          {isFilled && <rect x="4" y="4" width="2" height="2" fill="#FFFFFF" opacity="0.8" />}
        </svg>
      );
    })}
  </div>
);

// Minecraft Experience Bar
export const MinecraftXPBar: React.FC<{ progressPercent: number; levelNumber: number }> = ({ progressPercent, levelNumber }) => (
  <div className="flex flex-col items-center w-full max-w-sm">
    <span className="font-mono font-black text-sm text-[#80FF20] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] -mb-1 z-10">
      {levelNumber}
    </span>
    {/* Bar container */}
    <div className="w-full h-3 bg-[#111111] border border-[#222222] rounded-xs relative overflow-hidden flex items-center p-0.5">
      <div
        className="h-full bg-gradient-to-r from-[#62C81C] to-[#80FF20] transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
      />
      {/* Segment separators like in Minecraft */}
      <div className="absolute inset-0 flex justify-between pointer-events-none px-2 opacity-30">
        <div className="w-0.5 h-full bg-black"></div>
        <div className="w-0.5 h-full bg-black"></div>
        <div className="w-0.5 h-full bg-black"></div>
        <div className="w-0.5 h-full bg-black"></div>
      </div>
    </div>
  </div>
);

// Minecraft 9-slot Hotbar (Classic bottom inventory bar)
export const MinecraftHotbar: React.FC<{ activeIndex?: number }> = ({ activeIndex = 0 }) => {
  const items = [
    { icon: '🏹', name: 'Лук' },
    { icon: '❄️', name: 'Сніжка' },
    { icon: '🧭', name: 'Компас' },
    { icon: '💎', name: 'Алмаз' },
    { icon: '🧱', name: 'Камінь' },
    { icon: '⛏️', name: 'Кайло' },
    { icon: '🍎', name: 'Яблуко' },
    { icon: '🧪', name: 'Зілля' },
    { icon: '🧨', name: 'TNT' },
  ];

  return (
    <div className="flex items-center justify-center p-1 bg-[#8F8F8F] border-2 border-t-[#C6C6C6] border-l-[#C6C6C6] border-b-[#373737] border-r-[#373737] rounded-sm shadow-xl">
      <div className="flex gap-1">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-lg sm:text-xl relative ${
                isActive
                  ? 'border-2 border-white bg-[#555555] scale-105 shadow-md z-10'
                  : 'bg-[#8B8B8B] border border-t-[#373737] border-l-[#373737] border-b-[#C6C6C6] border-r-[#C6C6C6]'
              }`}
              title={item.name}
            >
              <span className="select-none">{item.icon}</span>
              <span className="absolute bottom-0.5 right-0.5 text-[9px] font-mono text-white opacity-80 leading-none">
                {idx + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
