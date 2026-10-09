import React from 'react';
import {
  MinecraftPig,
  MinecraftSheep,
  MinecraftWolf,
  MinecraftCreeper,
  CrosshairMarker,
  SnowballIcon,
} from './PixelGraphics';
import { RadarAttempt } from '../types';

interface TopViewGridProps {
  target: { x: number; z: number };
  revealTarget?: boolean;
  previewX?: number;
  previewZ?: number;
  lastShot?: { x: number; z: number; isHit: boolean } | null;
  radarAttempts?: RadarAttempt[];
  levelMode: 1 | 3;
  roundNumber?: number; // 1, 2, or 3
}

export const TopViewGrid: React.FC<TopViewGridProps> = ({
  target,
  revealTarget = true,
  previewX,
  previewZ,
  lastShot,
  radarAttempts = [],
  levelMode,
  roundNumber = 1,
}) => {
  // Calculate eliminated bounds for Level 3 (Radar/Rozvidnyk)
  let minX = 0;
  let maxX = 9;
  let minZ = 0;
  let maxZ = 9;
  let isXLocked = false;
  let isZLocked = false;

  if (levelMode === 3 && radarAttempts.length > 0) {
    radarAttempts.forEach((att) => {
      // X constraints
      if (att.xHint === 'bigger') {
        minX = Math.max(minX, att.x + 1);
      } else if (att.xHint === 'smaller') {
        maxX = Math.min(maxX, att.x - 1);
      } else if (att.xHint === 'correct') {
        minX = att.x;
        maxX = att.x;
        isXLocked = true;
      }

      // Z constraints
      if (att.zHint === 'bigger') {
        minZ = Math.max(minZ, att.z + 1);
      } else if (att.zHint === 'smaller') {
        maxZ = Math.min(maxZ, att.z - 1);
      } else if (att.zHint === 'correct') {
        minZ = att.z;
        maxZ = att.z;
        isZLocked = true;
      }
    });
  }

  // Render target mob for Level 1 based on round
  const renderLevel1Mob = () => {
    switch (roundNumber) {
      case 1:
        return <MinecraftPig size={28} />;
      case 2:
        return <MinecraftSheep size={28} />;
      case 3:
      default:
        return <MinecraftWolf size={28} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full max-w-[500px]">
        {/* Top Axis X Label & Coordinate Numbers */}
        <div className="flex items-center justify-between text-xs font-black text-amber-300 mb-1 pl-10 pr-2 tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 border border-amber-600 animate-pulse"></span>
            <span>Вісь X ➔ (вправо від 0 до 9)</span>
          </div>
          {isXLocked && (
            <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.5 rounded-xs font-mono font-bold animate-pulse">
              X ВГАДАНО! ✓
            </span>
          )}
        </div>

        {/* X Numbers Row: 0 to 9 */}
        <div className="grid grid-cols-[38px_repeat(10,1fr)] sm:grid-cols-[42px_repeat(10,1fr)] items-center mb-1">
          {/* Origin Corner (0,0) */}
          <div
            className="flex items-center justify-center font-mono text-[10px] sm:text-xs font-black text-emerald-300 bg-[#2D2D2D] rounded-xs border-2 border-emerald-500 py-1 shadow-sm"
            title="Початок координат (0,0)"
          >
            (0,0)
          </div>

          {Array.from({ length: 10 }).map((_, x) => {
            const isHighlightX = previewX === x;
            const isCurrentXLocked = isXLocked && target.x === x;

            return (
              <div
                key={`x-${x}`}
                className={`flex items-center justify-center font-mono font-black text-xs sm:text-sm py-1 rounded-xs transition-colors ${
                  isCurrentXLocked
                    ? 'bg-emerald-500 text-black scale-110 shadow-md z-10'
                    : isHighlightX
                    ? 'bg-amber-400 text-black scale-110 shadow-md z-10'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                {x}
              </div>
            );
          })}
        </div>

        {/* 10x10 Minecraft Top-down Grid */}
        <div className="grid grid-cols-[38px_repeat(10,1fr)] sm:grid-cols-[42px_repeat(10,1fr)] gap-1 p-2 bg-[#1B1B1B] rounded-lg border-4 border-[#3D3D3D] shadow-2xl relative overflow-hidden">
          {Array.from({ length: 10 }).map((_, z) => {
            const isHighlightZ = previewZ === z;
            const isCurrentZLocked = isZLocked && target.z === z;

            return (
              <React.Fragment key={`row-${z}`}>
                {/* Z Axis Label Cell */}
                <div
                  className={`flex items-center justify-center font-mono font-black text-xs sm:text-sm rounded-xs transition-colors select-none ${
                    isCurrentZLocked
                      ? 'bg-emerald-500 text-black scale-110 shadow-md z-10'
                      : isHighlightZ
                      ? 'bg-cyan-400 text-black scale-110 shadow-md z-10'
                      : 'text-cyan-200 hover:text-white bg-[#262626] border border-[#3A3A3A]'
                  }`}
                  title={`Рядок Z = ${z}`}
                >
                  {z}
                </div>

                {/* 10 Grid Cells for this row */}
                {Array.from({ length: 10 }).map((_, x) => {
                  const isTarget = target.x === x && target.z === z;
                  const isLastShot = lastShot && lastShot.x === x && lastShot.z === z;
                  const isPreview = previewX === x && previewZ === z;

                  // Radar logic: check if this cell is eliminated by previous clues
                  const isEliminated =
                    levelMode === 3 &&
                    radarAttempts.length > 0 &&
                    (x < minX || x > maxX || z < minZ || z > maxZ);

                  // Past attempt on this exact cell
                  const attemptIndex = radarAttempts.findIndex((att) => att.x === x && att.z === z);
                  const attempt = attemptIndex >= 0 ? radarAttempts[attemptIndex] : null;

                  // Minecraft Grass Top Checkered tones (#388E3C and #2E7D32)
                  const isEven = (x + z) % 2 === 0;

                  return (
                    <div
                      key={`cell-${x}-${z}`}
                      className={`aspect-square w-full rounded-xs relative flex items-center justify-center p-0 transition-all select-none overflow-hidden ${
                        isEliminated
                          ? 'bg-[#181818] border border-[#222222] opacity-40'
                          : isEven
                          ? 'bg-[#388E3C] border border-[#2E7D32]'
                          : 'bg-[#2E7D32] border border-[#1B5E20]'
                      } ${
                        isPreview
                          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black z-20 scale-105'
                          : ''
                      }`}
                    >
                      {/* Pixel speckles on grass */}
                      {!isEliminated && (
                        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4CAF50_1px,transparent_1px)] [background-size:4px_4px]"></div>
                      )}

                      {/* Locked axis beam highlight */}
                      {levelMode === 3 && (isXLocked && x === target.x || isZLocked && z === target.z) && !isEliminated && (
                        <div className="absolute inset-0 bg-emerald-400/20 pointer-events-none border border-emerald-400/40"></div>
                      )}

                      {/* Level 1 Target Mob */}
                      {levelMode === 1 && revealTarget && isTarget && (
                        <div className="relative z-20 animate-bounce">
                          {renderLevel1Mob()}
                        </div>
                      )}

                      {/* Level 1 Last Shot (Snowball or Miss) */}
                      {levelMode === 1 && isLastShot && !lastShot.isHit && (
                        <div className="relative z-20 animate-pulse">
                          <CrosshairMarker size={24} />
                        </div>
                      )}

                      {/* Level 3: Hidden Creeper (revealed on hit or timeout) */}
                      {levelMode === 3 && revealTarget && isTarget && (
                        <div className="relative z-20 animate-bounce">
                          <MinecraftCreeper size={28} />
                        </div>
                      )}

                      {/* Level 3: Radar probe marker */}
                      {levelMode === 3 && attempt && (
                        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center bg-black/85 border-2 border-cyan-400 text-white shadow-inner">
                          <span className="text-[10px] sm:text-xs font-mono font-black text-cyan-300 leading-none">
                            #{attemptIndex + 1}
                          </span>
                          {/* Direction arrow clues */}
                          <div className="text-[8px] font-black text-amber-300 leading-none flex gap-0.5 mt-0.5">
                            {attempt.xHint === 'bigger' && '➔'}
                            {attempt.xHint === 'smaller' && '⬅'}
                            {attempt.xHint === 'correct' && '✓'}
                            {attempt.zHint === 'bigger' && '⬇'}
                            {attempt.zHint === 'smaller' && '⬆'}
                            {attempt.zHint === 'correct' && '✓'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Z-Axis Label */}
        <div className="flex items-center justify-between text-xs font-black text-cyan-300 mt-1 pl-10 pr-2 tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 border border-cyan-600 animate-pulse"></span>
            <span>Вісь Z ⬇ (вниз від 0 до 9)</span>
          </div>
          {isZLocked && (
            <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.5 rounded-xs font-mono font-bold animate-pulse">
              Z ВГАДАНО! ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
