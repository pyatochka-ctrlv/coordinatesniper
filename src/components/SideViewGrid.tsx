import React from 'react';
import { CrosshairMarker, DiamondOre, MinecraftEnderman } from './PixelGraphics';

interface SideViewGridProps {
  target: { x: number; y: number };
  previewX: number;
  previewY: number;
  lastShot?: { x: number; y: number; isHit: boolean } | null;
}

// Decorative pillars and ore blocks for authentic Minecraft landscape
const COBBLESTONE_PILLARS: Record<number, number> = {
  2: 3, // Pillar at X=2 up to Y=3
  5: 4, // Pillar at X=5 up to Y=4
  8: 2, // Pillar at X=8 up to Y=2
};

const FLOATING_ORES: Array<{ x: number; y: number }> = [
  { x: 3, y: 6 },
  { x: 7, y: 7 },
  { x: 1, y: 5 },
];

export const SideViewGrid: React.FC<SideViewGridProps> = ({
  target,
  previewX,
  previewY,
  lastShot,
}) => {
  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full max-w-[500px]">
        {/* Y Axis Header Label */}
        <div className="flex items-center justify-between text-xs font-black text-emerald-300 mb-1 pl-10 pr-2 tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 border border-emerald-600 animate-pulse"></span>
            <span>Вісь Y ⬆ (висота від землі вгору: 0 .. 9)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Y = 9 (небо)</span>
        </div>

        {/* 10x10 Side View Grid Container */}
        <div className="grid grid-cols-[38px_repeat(10,1fr)] sm:grid-cols-[42px_repeat(10,1fr)] gap-1 p-2 bg-gradient-to-b from-[#1A237E] via-[#0D1B2A] to-[#121212] rounded-lg border-4 border-[#3D3D3D] shadow-2xl relative overflow-hidden">
          {/* Pixel Minecraft Clouds in Sky */}
          <div className="absolute top-2 left-6 right-6 flex justify-between opacity-30 pointer-events-none">
            <div className="w-20 h-4 bg-white/70 rounded-xs"></div>
            <div className="w-28 h-5 bg-white/60 rounded-xs"></div>
            <div className="w-16 h-3 bg-white/50 rounded-xs"></div>
          </div>

          {/* Rows from top (Y = 9) down to ground (Y = 0) */}
          {Array.from({ length: 10 }).map((_, rowIndex) => {
            const y = 9 - rowIndex;
            const isHighlightY = previewY === y;
            const isGround = y === 0;

            return (
              <React.Fragment key={`row-y-${y}`}>
                {/* Left Y Axis Label */}
                <div
                  className={`flex items-center justify-center font-mono font-black text-xs sm:text-sm rounded-xs transition-colors select-none ${
                    isHighlightY
                      ? 'bg-emerald-400 text-black scale-110 shadow-md z-10'
                      : isGround
                      ? 'text-lime-300 bg-[#1B5E20] border-2 border-lime-500 font-bold'
                      : 'text-emerald-200 hover:text-white bg-[#262626] border border-[#3A3A3A]'
                  }`}
                  title={isGround ? 'Рівень землі: Y = 0' : `Висота Y = ${y}`}
                >
                  {y}
                </div>

                {/* 10 columns for this height level (X = 0..9) */}
                {Array.from({ length: 10 }).map((_, x) => {
                  const isTarget = target.x === x && target.y === y;
                  const isShot = lastShot && lastShot.x === x && lastShot.y === y;
                  const isPreview = previewX === x && previewY === y;

                  const pillarMaxY = COBBLESTONE_PILLARS[x];
                  const isPillar = pillarMaxY !== undefined && y <= pillarMaxY && !isGround && !isTarget;
                  const isOre = FLOATING_ORES.some((o) => o.x === x && o.y === y) && !isTarget;

                  return (
                    <div
                      key={`cell-${x}-${y}`}
                      className={`aspect-square w-full rounded-xs relative flex items-center justify-center p-0 select-none overflow-hidden transition-all ${
                        isGround
                          ? 'bg-[#388E3C] border-t-2 border-lime-400 border-b-2 border-[#1B5E20]'
                          : isPillar
                          ? 'bg-[#616161] border border-[#424242]'
                          : isOre
                          ? 'bg-transparent'
                          : 'bg-black/30 border border-white/5'
                      } ${
                        isPreview
                          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black z-20 scale-105'
                          : ''
                      }`}
                      title={`(X: ${x}, Y: ${y})${isGround ? ' — Земля' : ''}`}
                    >
                      {/* Floating Diamond Ore Decor */}
                      {isOre && <DiamondOre size={24} />}

                      {/* Cobblestone texture dots */}
                      {isPillar && (
                        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:4px_4px]"></div>
                      )}

                      {/* Ground Grass Fringe */}
                      {isGround && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-lime-400 opacity-90 pointer-events-none"></div>
                      )}

                      {/* Target Enderman */}
                      {isTarget && (
                        <div className="relative z-20 animate-bounce">
                          <MinecraftEnderman size={28} />
                        </div>
                      )}

                      {/* Missed Crosshair */}
                      {isShot && !lastShot.isHit && (
                        <div className="relative z-20 animate-pulse">
                          <CrosshairMarker size={24} />
                        </div>
                      )}

                      {/* Label on ground (0,0) */}
                      {isGround && x === 0 && (
                        <span className="absolute bottom-0 text-[7px] font-mono font-bold text-black bg-lime-400 px-0.5 rounded-xs leading-none">
                          земля
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom X-Axis Numbers: 0 to 9 */}
        <div className="grid grid-cols-[38px_repeat(10,1fr)] sm:grid-cols-[42px_repeat(10,1fr)] items-center mt-1">
          {/* Origin Badge (0,0) */}
          <div
            className="flex items-center justify-center font-mono text-[10px] sm:text-xs font-black text-amber-300 bg-[#2D2D2D] rounded-xs border-2 border-amber-500 py-1 shadow-sm"
            title="Початок координат (X=0, Y=0)"
          >
            (0,0)
          </div>

          {Array.from({ length: 10 }).map((_, x) => {
            const isHighlightX = previewX === x;
            return (
              <div
                key={`x-axis-${x}`}
                className={`flex items-center justify-center font-mono font-black text-xs sm:text-sm py-1 rounded-xs transition-colors ${
                  isHighlightX
                    ? 'bg-amber-400 text-black scale-110 shadow-md z-10'
                    : 'text-amber-200 hover:text-white'
                }`}
              >
                {x}
              </div>
            );
          })}
        </div>

        {/* Bottom X-Axis Label */}
        <div className="flex items-center justify-between text-xs font-black text-amber-300 mt-1 pl-10 pr-2 tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 border border-amber-600 animate-pulse"></span>
            <span>Вісь X ➔ (горизонталь від 0 до 9)</span>
          </div>
          <span className="text-[11px] font-mono text-lime-400">Y = 0 (Земля)</span>
        </div>
      </div>
    </div>
  );
};
