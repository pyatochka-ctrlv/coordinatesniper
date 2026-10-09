import React, { useState } from 'react';
import {
  MinecraftPig,
  MinecraftEnderman,
  MinecraftCreeper,
  DiamondOre,
  MinecraftHotbar,
  MinecraftHearts,
} from './PixelGraphics';
import { GameStats } from '../types';
import { playClickSound } from '../sound';

interface ResultsScreenProps {
  stats: GameStats;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ stats, onRestart }) => {
  const [classNameTitle, setClassNameTitle] = useState('Наш Клас');

  const totalScore = stats.levelScores.reduce((acc, score) => acc + score, 0);
  const maxScore = 9;
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Analyze most frequent error pattern
  const analyzeErrors = () => {
    const { swappedXZCount, countedFromOneCount, heightYErrorCount, totalMisses } = stats;

    if (totalMisses === 0) {
      return {
        badge: '🏆 Ідеальна Координатна Майстерність!',
        description: 'Бездоганний результат! Жодної помилки! Клас впорався як справжні про-гравці Minecraft!',
        tip: 'Ви готові будувати за допомогою координат стіни, замки та писати команди в чат!',
      };
    }

    if (swappedXZCount >= countedFromOneCount && swappedXZCount >= heightYErrorCount && swappedXZCount > 0) {
      return {
        badge: 'Зверніть увагу: X і Z переплутано',
        description: 'Найчастіше координати мінялися місцями (наприклад, замість X=4, Z=2 називали X=2, Z=4).',
        tip: 'Завжди називайте спочатку X (крок вправо ➔), а потім Z (крок вниз ⬇)!',
      };
    }

    if (heightYErrorCount >= countedFromOneCount && heightYErrorCount > 0) {
      return {
        badge: 'Складнощі з висотою Y',
        description: 'Найбільше неточностей було при визначенні висоти Ендермена на виді збоку.',
        tip: 'Пам’ятайте: висота Y завжди рахується від землі вгору! Земля — це Y = 0.',
      };
    }

    if (countedFromOneCount > 0) {
      return {
        badge: 'Рахунок з 1 замість 0',
        description: 'Кілька разів помилка була рівно на 1 клітинку (рахували з 1).',
        tip: 'У Minecraft координати завжди починаються з нуля: перша клітинка — це 0!',
      };
    }

    return {
      badge: 'Відмінна командна робота!',
      description: 'Клас продемонстрував чудову орієнтацію на карті та швидко виправляв приціл!',
      tip: 'Тепер координати X, Y, Z для вас — це проста мова гри!',
    };
  };

  const analysis = analyzeErrors();

  const handleRestartClick = () => {
    playClickSound();
    onRestart();
  };

  const formattedDate = new Date().toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-5 sm:p-7 bg-[#1F1F1F] border-4 border-[#3D3D3D] rounded-xl shadow-2xl text-white">
      {/* Top Banner / Exit Ticket Header */}
      <div className="border-b-2 border-dashed border-[#555555] pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-sm text-xs font-black uppercase tracking-wider mb-2">
          <span>🎮</span>
          <span>Minecraft Education • Урок 5 «Таємниці координат»</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#55FF55] tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Координатний Снайпер: Результати
        </h1>

        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          <label htmlFor="class-input" className="text-slate-400 font-bold">Команда:</label>
          <input
            id="class-input"
            type="text"
            value={classNameTitle}
            onChange={(e) => setClassNameTitle(e.target.value)}
            className="bg-[#2B2B2B] text-amber-300 font-black px-3 py-1 rounded-sm border-2 border-[#555555] focus:outline-none focus:border-emerald-400 text-center text-base"
          />
        </div>
      </div>

      {/* Main Score Hero */}
      <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6 bg-[#161616] rounded-lg p-5 my-5 border-2 border-[#333333]">
        <div className="flex items-center gap-4">
          <DiamondOre size={64} />
          <div>
            <div className="text-xs uppercase text-slate-400 font-bold tracking-wider">
              Загальний досвід XP
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-black text-[#55FF55] drop-shadow-md">
              {totalScore} / {maxScore}
            </div>
            <div className="text-sm font-bold text-slate-300 mt-1">
              Влучність: <span className="text-amber-400 font-mono">{percentage}%</span>
            </div>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-3xl font-black text-amber-300">
            {totalScore === 9 ? '🏆 🏆 🏆' : totalScore >= 7 ? '⭐⭐⭐' : '⭐⭐'}
          </div>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            {totalScore === 9
              ? 'Алмазний Майстер Координат'
              : totalScore >= 7
              ? 'Влучний Снайпер Класу'
              : 'Дослідник-Початківець'}
          </div>
          <div className="text-xs text-slate-400 mt-1">{formattedDate}</div>
        </div>
      </div>

      {/* 3 Level Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        {/* Level 1 */}
        <div className="bg-[#262626] p-4 rounded-sm border-2 border-[#3A3A3A] flex flex-col items-center text-center">
          <MinecraftPig size={36} />
          <span className="text-xs font-black text-slate-300 uppercase mt-2">Рівень 1</span>
          <span className="text-xs text-slate-400">Порятунок мобів (X, Z)</span>
          <span className="text-2xl font-mono font-black text-amber-400 mt-2">
            {stats.levelScores[0]} / 3
          </span>
        </div>

        {/* Level 2 */}
        <div className="bg-[#262626] p-4 rounded-sm border-2 border-[#3A3A3A] flex flex-col items-center text-center">
          <MinecraftEnderman size={36} />
          <span className="text-xs font-black text-slate-300 uppercase mt-2">Рівень 2</span>
          <span className="text-xs text-slate-400">Висота Y та Ендермен</span>
          <span className="text-2xl font-mono font-black text-emerald-400 mt-2">
            {stats.levelScores[1]} / 3
          </span>
        </div>

        {/* Level 3 */}
        <div className="bg-[#262626] p-4 rounded-sm border-2 border-[#3A3A3A] flex flex-col items-center text-center">
          <MinecraftCreeper size={36} />
          <span className="text-xs font-black text-slate-300 uppercase mt-2">Рівень 3</span>
          <span className="text-xs text-slate-400">Компас і Кріпер (радар)</span>
          <span className="text-2xl font-mono font-black text-cyan-400 mt-2">
            {stats.levelScores[2]} / 3
          </span>
        </div>
      </div>

      {/* Analysis Card */}
      <div className="bg-[#171717] border-2 border-emerald-500/50 rounded-sm p-4 my-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🧭</span>
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
            Аналіз гри класу та рекомендація для уроку:
          </h3>
        </div>

        <div className="inline-block px-3 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xs text-sm font-black mb-2">
          {analysis.badge}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          {analysis.description}
        </p>

        <div className="mt-3 p-3 bg-amber-500/10 border-l-4 border-amber-400 text-xs text-amber-200 font-semibold">
          💡 <span className="font-bold">Порада вчителю:</span> {analysis.tip}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleRestartClick}
          className="min-h-[52px] px-8 py-3 bg-[#388E3C] hover:bg-[#4CAF50] active:bg-[#1B5E20] text-white font-black text-lg rounded-sm shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center gap-3 border-2 border-[#81C784] touch-manipulation uppercase"
        >
          <span>🔄</span>
          <span>Зіграти ще раз (Нові координати)</span>
        </button>
      </div>
    </div>
  );
};
