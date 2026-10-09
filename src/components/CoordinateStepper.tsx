import React from 'react';
import { playClickSound } from '../sound';

interface CoordinateStepperProps {
  label: string;
  axis: 'X' | 'Y' | 'Z';
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const CoordinateStepper: React.FC<CoordinateStepperProps> = ({
  label,
  axis,
  value,
  onChange,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (disabled || value <= 0) return;
    playClickSound();
    onChange(value - 1);
  };

  const handleIncrement = () => {
    if (disabled || value >= 9) return;
    playClickSound();
    onChange(value + 1);
  };

  const handleQuickSelect = (num: number) => {
    if (disabled || num === value) return;
    playClickSound();
    onChange(num);
  };

  const getAxisTheme = () => {
    switch (axis) {
      case 'X':
        return {
          color: 'text-amber-400',
          border: 'border-amber-500/50',
          bg: 'bg-amber-950/40',
          badge: 'bg-amber-500 text-slate-950',
          btnActive: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
          direction: 'вправо ➔',
        };
      case 'Z':
        return {
          color: 'text-cyan-400',
          border: 'border-cyan-500/50',
          bg: 'bg-cyan-950/40',
          badge: 'bg-cyan-500 text-slate-950',
          btnActive: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
          direction: 'вниз ⬇',
        };
      case 'Y':
        return {
          color: 'text-emerald-400',
          border: 'border-emerald-500/50',
          bg: 'bg-emerald-950/40',
          badge: 'bg-emerald-500 text-slate-950',
          btnActive: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
          direction: 'вгору (висота) ⬆',
        };
    }
  };

  const theme = getAxisTheme();

  return (
    <div className={`p-3 rounded-2xl border-2 ${theme.border} ${theme.bg} shadow-md backdrop-blur-sm flex flex-col gap-2 transition-all`}>
      {/* Label and direction helper */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-lg font-black text-sm uppercase ${theme.badge}`}>
            Вісь {axis}
          </span>
          <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
            {theme.direction}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>

      {/* Big Stepper Controls (Min 48px touch targets) */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= 0}
          aria-label={`Зменшити ${axis}`}
          className={`w-14 h-14 min-w-[52px] min-h-[52px] rounded-xl flex items-center justify-center text-3xl font-black transition-all select-none active:scale-95 touch-manipulation shadow-md ${
            value <= 0 || disabled
              ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed opacity-50'
              : 'bg-slate-700 text-white border-2 border-slate-500 hover:bg-slate-600 active:bg-slate-500 shadow-slate-900/50 cursor-pointer'
          }`}
        >
          −
        </button>

        {/* Huge Value Display */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/70 border border-slate-700 rounded-xl py-1 px-4 shadow-inner min-h-[52px]">
          <span className={`text-4xl font-mono font-black tracking-wider leading-none ${theme.color}`}>
            {value}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
            {axis} = {value}
          </span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= 9}
          aria-label={`Збільшити ${axis}`}
          className={`w-14 h-14 min-w-[52px] min-h-[52px] rounded-xl flex items-center justify-center text-3xl font-black transition-all select-none active:scale-95 touch-manipulation shadow-md ${
            value >= 9 || disabled
              ? 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed opacity-50'
              : 'bg-slate-700 text-white border-2 border-slate-500 hover:bg-slate-600 active:bg-slate-500 shadow-slate-900/50 cursor-pointer'
          }`}
        >
          +
        </button>
      </div>

      {/* Quick Select Number Strip (0 to 9) for fast tablet tapping */}
      <div className="grid grid-cols-10 gap-1 pt-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          const isSelected = n === value;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => handleQuickSelect(n)}
              className={`h-8 sm:h-9 rounded-md font-mono text-xs sm:text-sm font-bold flex items-center justify-center transition-all touch-manipulation ${
                isSelected
                  ? `${theme.btnActive} ring-2 ring-white font-black scale-105 shadow-md z-10`
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-90'}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
};
