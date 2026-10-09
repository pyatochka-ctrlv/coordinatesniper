/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, GameStats, Point2D, PointSide, RadarAttempt } from './types';
import { CoordinateStepper } from './components/CoordinateStepper';
import { TopViewGrid } from './components/TopViewGrid';
import { SideViewGrid } from './components/SideViewGrid';
import { ResultsScreen } from './components/ResultsScreen';
import {
  MinecraftPig,
  MinecraftSheep,
  MinecraftWolf,
  MinecraftEnderman,
  MinecraftCreeper,
  MinecraftHearts,
  MinecraftXPBar,
  MinecraftHotbar,
  DiamondOre,
} from './components/PixelGraphics';
import {
  playClickSound,
  playXpPlingSound,
  playBowShootSound,
  playMissBlockSound,
  playCompassPingSound,
  playCreeperHissSound,
  playLevelUpSound,
  setMuted,
} from './sound';
import { Volume2, VolumeX, HelpCircle, ArrowRight } from 'lucide-react';

function pluralizeCell(n: number): string {
  const abs = Math.abs(n) % 100;
  const rem = abs % 10;
  if (abs > 10 && abs < 20) return 'клітинок';
  if (rem > 1 && rem < 5) return 'клітинки';
  if (rem === 1) return 'клітинку';
  return 'клітинок';
}

function pluralizeBlocks(n: number): string {
  const abs = Math.abs(n) % 100;
  const rem = abs % 10;
  if (abs > 10 && abs < 20) return 'блоків';
  if (rem > 1 && rem < 5) return 'блоки';
  if (rem === 1) return 'блок';
  return 'блоків';
}

function pluralizeShots(n: number): string {
  const abs = Math.abs(n) % 100;
  const rem = abs % 10;
  if (abs > 10 && abs < 20) return 'спроб';
  if (rem > 1 && rem < 5) return 'спроби';
  if (rem === 1) return 'спробу';
  return 'спроб';
}

function generateRandomPoint2D(prev?: Point2D): Point2D {
  let p: Point2D;
  do {
    p = {
      x: Math.floor(Math.random() * 10),
      z: Math.floor(Math.random() * 10),
    };
  } while (prev && prev.x === p.x && prev.z === p.z);
  return p;
}

function generateRandomPointSide(prev?: PointSide): PointSide {
  let p: PointSide;
  do {
    p = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
  } while (prev && prev.x === p.x && prev.y === p.y);
  return p;
}

const INITIAL_STATS: GameStats = {
  levelScores: [0, 0, 0],
  swappedXZCount: 0,
  countedFromOneCount: 0,
  heightYErrorCount: 0,
  totalMisses: 0,
  level3ShotsPerRound: [],
};

export default function App() {
  const [level, setLevel] = useState<GameMode>(1);
  const [round, setRound] = useState<number>(1);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Stepper inputs
  const [inputX, setInputX] = useState<number>(0);
  const [inputZ, setInputZ] = useState<number>(0);
  const [inputY, setInputY] = useState<number>(0);

  // Level 1: Mob Rescue (Top View X & Z)
  const [l1Target, setL1Target] = useState<Point2D>(() => generateRandomPoint2D());
  const [l1LastShot, setL1LastShot] = useState<{ x: number; z: number; isHit: boolean } | null>(null);

  // Level 2: Enderman Height (Side View X & Y)
  const [l2Target, setL2Target] = useState<PointSide>(() => generateRandomPointSide());
  const [l2LastShot, setL2LastShot] = useState<{ x: number; y: number; isHit: boolean } | null>(null);

  // Level 3: Hidden Creeper Compass (Top View Radar)
  const [l3Target, setL3Target] = useState<Point2D>(() => generateRandomPoint2D());
  const [l3Attempts, setL3Attempts] = useState<RadarAttempt[]>([]);
  const [l3Revealed, setL3Revealed] = useState<boolean>(false);
  const [l3RoundFinished, setL3RoundFinished] = useState<boolean>(false);

  // Round Feedback & Progress state
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isFeedbackPositive, setIsFeedbackPositive] = useState<boolean>(true);

  // Audio Toggle
  const toggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    setMuted(next);
    if (!next) playClickSound();
  };

  // Reset inputs for fresh round
  const resetRoundInputs = useCallback(() => {
    setInputX(0);
    setInputZ(0);
    setInputY(0);
    setRoundCompleted(false);
    setFeedbackMessage('');
    setL1LastShot(null);
    setL2LastShot(null);
    setL3Attempts([]);
    setL3Revealed(false);
    setL3RoundFinished(false);
  }, []);

  // Level 1: Shot handler
  const handleLevel1Shot = useCallback(() => {
    if (roundCompleted) return;
    playBowShootSound();

    const isHit = inputX === l1Target.x && inputZ === l1Target.z;
    setL1LastShot({ x: inputX, z: inputZ, isHit });

    const mobName = round === 1 ? 'свинку' : round === 2 ? 'вівцю' : 'песика';

    if (isHit) {
      playXpPlingSound();
      setIsFeedbackPositive(true);
      setFeedbackMessage(`Влучно! Ми знайшли та врятували ${mobName}! Координати: (X = ${inputX}, Z = ${inputZ})!`);
      setRoundCompleted(true);
      setStats((prev) => {
        const scores = [...prev.levelScores] as [number, number, number];
        scores[0] += 1;
        return { ...prev, levelScores: scores };
      });
    } else {
      playMissBlockSound();
      setIsFeedbackPositive(false);

      const dx = l1Target.x - inputX;
      const dz = l1Target.z - inputZ;

      let msg = '';
      if (dx !== 0 && dz === 0) {
        msg = `Сніжка впала на X = ${inputX}. Треба на ${Math.abs(dx)} ${pluralizeCell(Math.abs(dx))} ${dx > 0 ? 'правіше ➔' : 'лівіше ⬅'}!`;
      } else if (dz !== 0 && dx === 0) {
        msg = `Сніжка впала на Z = ${inputZ}. Треба на ${Math.abs(dz)} ${pluralizeCell(Math.abs(dz))} ${dz > 0 ? 'нижче ⬇' : 'вище ⬆'}!`;
      } else {
        msg = `Моб на (X = ${l1Target.x}, Z = ${l1Target.z}). Потрібно зміститися на ${Math.abs(dx)} ${dx > 0 ? 'правіше ➔' : 'лівіше ⬅'} та на ${Math.abs(dz)} ${dz > 0 ? 'нижче ⬇' : 'вище ⬆'}!`;
      }
      setFeedbackMessage(msg);

      setStats((prev) => {
        let swapped = prev.swappedXZCount;
        let countedOne = prev.countedFromOneCount;
        if (inputX === l1Target.z && inputZ === l1Target.x) swapped += 1;
        if (inputX === l1Target.x + 1 || inputZ === l1Target.z + 1) countedOne += 1;
        return {
          ...prev,
          swappedXZCount: swapped,
          countedFromOneCount: countedOne,
          totalMisses: prev.totalMisses + 1,
        };
      });
    }
  }, [roundCompleted, inputX, inputZ, l1Target, round]);

  // Level 2: Shot handler (Enderman Height)
  const handleLevel2Shot = useCallback(() => {
    if (roundCompleted) return;
    playBowShootSound();

    const isHit = inputX === l2Target.x && inputY === l2Target.y;
    setL2LastShot({ x: inputX, y: inputY, isHit });

    if (isHit) {
      playXpPlingSound();
      setIsFeedbackPositive(true);
      setFeedbackMessage(`Влучно! Ендермена знайдено на висоті Y = ${inputY}! Телепортація активована!`);
      setRoundCompleted(true);
      setStats((prev) => {
        const scores = [...prev.levelScores] as [number, number, number];
        scores[1] += 1;
        return { ...prev, levelScores: scores };
      });
    } else {
      playMissBlockSound();
      setIsFeedbackPositive(false);

      const dy = l2Target.y - inputY;
      const dx = l2Target.x - inputX;

      let msg = '';
      if (dy !== 0 && dx === 0) {
        msg = `Твій Y = ${inputY}, а Ендермен на Y = ${l2Target.y}. Потрібно ${dy > 0 ? 'вище ⬆' : 'нижче ⬇'} на ${Math.abs(dy)} ${pluralizeBlocks(Math.abs(dy))}!`;
      } else if (dx !== 0 && dy === 0) {
        msg = `Висота правильна! Але по X потрібно на ${Math.abs(dx)} ${dx > 0 ? 'правіше ➔' : 'лівіше ⬅'}!`;
      } else {
        msg = `Твій Y = ${inputY} (${dy > 0 ? 'треба вище ⬆' : 'треба нижче ⬇'}), а по X треба на ${Math.abs(dx)} ${dx > 0 ? 'правіше ➔' : 'лівіше ⬅'}!`;
      }
      setFeedbackMessage(msg);

      setStats((prev) => ({
        ...prev,
        heightYErrorCount: dy !== 0 ? prev.heightYErrorCount + 1 : prev.heightYErrorCount,
        countedFromOneCount: inputY === l2Target.y + 1 || inputX === l2Target.x + 1 ? prev.countedFromOneCount + 1 : prev.countedFromOneCount,
        totalMisses: prev.totalMisses + 1,
      }));
    }
  }, [roundCompleted, inputX, inputY, l2Target]);

  // Level 3: Shot handler (Creeper Compass / Radar)
  const handleLevel3Shot = useCallback(() => {
    if (roundCompleted || l3RoundFinished) return;

    const currentShots = l3Attempts.length + 1;
    const isHit = inputX === l3Target.x && inputZ === l3Target.z;

    const xHint = l3Target.x > inputX ? 'bigger' : l3Target.x < inputX ? 'smaller' : 'correct';
    const zHint = l3Target.z > inputZ ? 'bigger' : l3Target.z < inputZ ? 'smaller' : 'correct';

    const newAttempt: RadarAttempt = {
      x: inputX,
      z: inputZ,
      xHint,
      zHint,
    };

    const updatedAttempts = [...l3Attempts, newAttempt];
    setL3Attempts(updatedAttempts);

    if (isHit) {
      playLevelUpSound();
      setL3Revealed(true);
      setL3RoundFinished(true);
      setRoundCompleted(true);
      setIsFeedbackPositive(true);

      let praise = '';
      if (currentShots <= 3) {
        praise = `⭐ Майстер компаса! Кріпера знайдено всього за ${currentShots} ${pluralizeShots(currentShots)}!`;
      } else if (currentShots <= 5) {
        praise = `Чудова командна логіка! Кріпера знешкоджено за ${currentShots} спроб!`;
      } else {
        praise = `В останній момент! Кріпера знайдено на 6-й спробі! Перемога!`;
      }
      setFeedbackMessage(praise);

      setStats((prev) => {
        const scores = [...prev.levelScores] as [number, number, number];
        scores[2] += 1;
        return {
          ...prev,
          levelScores: scores,
          level3ShotsPerRound: [...prev.level3ShotsPerRound, currentShots],
        };
      });
    } else {
      if (currentShots >= 6) {
        // Run out of 6 attempts
        playCreeperHissSound();
        setL3Revealed(true);
        setL3RoundFinished(true);
        setRoundCompleted(true);
        setIsFeedbackPositive(false);
        setFeedbackMessage(
          `Sssss... Бум! Кріпер вискочив на (X = ${l3Target.x}, Z = ${l3Target.z})! Але клас був дуже близько!`
        );
        setStats((prev) => ({
          ...prev,
          totalMisses: prev.totalMisses + 1,
          level3ShotsPerRound: [...prev.level3ShotsPerRound, 6],
        }));
      } else {
        // Intermediate compass clue
        playCompassPingSound();
        setIsFeedbackPositive(false);
        const xText = xHint === 'bigger' ? 'X більший (правіше ➔)' : xHint === 'smaller' ? 'X менший (лівіше ⬅)' : 'X вгадано! ✓';
        const zText = zHint === 'bigger' ? 'Z більший (нижче ⬇)' : zHint === 'smaller' ? 'Z менший (вище ⬆)' : 'Z вгадано! ✓';
        setFeedbackMessage(`Спроба #${currentShots}: Компас каже: ${xText} • ${zText}`);
      }
    }
  }, [roundCompleted, l3RoundFinished, l3Attempts, inputX, inputZ, l3Target]);

  // Next round / Next level transition
  const handleNextRound = useCallback(() => {
    playClickSound();

    if (round < 3) {
      setRound((r) => r + 1);
      resetRoundInputs();

      if (level === 1) setL1Target(generateRandomPoint2D(l1Target));
      if (level === 2) setL2Target(generateRandomPointSide(l2Target));
      if (level === 3) setL3Target(generateRandomPoint2D(l3Target));
    } else {
      // Level completed!
      if (typeof level === 'number' && level < 3) {
        playLevelUpSound();
        const nextLevel = (level + 1) as GameMode;
        setLevel(nextLevel);
        setRound(1);
        resetRoundInputs();

        if (nextLevel === 2) setL2Target(generateRandomPointSide());
        if (nextLevel === 3) setL3Target(generateRandomPoint2D());
      } else {
        // All 3 levels finished!
        playLevelUpSound();
        setLevel('results');
      }
    }
  }, [round, level, resetRoundInputs, l1Target, l2Target, l3Target]);

  // Restart game
  const handleRestartGame = () => {
    setLevel(1);
    setRound(1);
    setStats(INITIAL_STATS);
    resetRoundInputs();
    setL1Target(generateRandomPoint2D());
  };

  // Keyboard shortcut listener for the teacher operating from laptop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        playClickSound();
        setInputX((x) => Math.min(9, x + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        playClickSound();
        setInputX((x) => Math.max(0, x - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        playClickSound();
        if (level === 2) {
          setInputY((y) => Math.min(9, y + 1));
        } else {
          setInputZ((z) => Math.max(0, z - 1));
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        playClickSound();
        if (level === 2) {
          setInputY((y) => Math.max(0, y - 1));
        } else {
          setInputZ((z) => Math.min(9, z + 1));
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!roundCompleted) {
          if (level === 1) handleLevel1Shot();
          if (level === 2) handleLevel2Shot();
          if (level === 3) handleLevel3Shot();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (roundCompleted) {
          handleNextRound();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [level, roundCompleted, handleLevel1Shot, handleLevel2Shot, handleLevel3Shot, handleNextRound]);

  // Total XP calculation (out of 9)
  const totalScore = stats.levelScores.reduce((a, b) => a + b, 0);
  const xpPercent = level === 'results' ? 100 : (totalScore / 9) * 100;

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans select-none pb-6">
      {/* Top Minecraft HUD Bar */}
      <header className="sticky top-0 z-40 bg-[#1E1E1E]/95 border-b-4 border-[#333333] backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#2B2B2B] border-2 border-[#555555] flex items-center justify-center text-xl shadow-inner">
            {level === 1 ? <MinecraftPig size={26} /> : level === 2 ? <MinecraftEnderman size={24} /> : <MinecraftCreeper size={26} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-[#55FF55] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                Координатний снайпер
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase bg-[#263238] text-amber-300 border border-amber-500 rounded-xs">
                Minecraft Education
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              Урок 5: Таємниці координат • Гра для демонстрації на екрані
            </p>
          </div>
        </div>

        {/* XP Bar in Header & Sound Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-center">
            <MinecraftXPBar progressPercent={xpPercent} levelNumber={totalScore} />
          </div>

          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="w-10 h-10 rounded-sm bg-[#2D2D2D] hover:bg-[#3D3D3D] border-2 border-[#555555] flex items-center justify-center text-amber-300 transition-colors cursor-pointer"
            title="Правила координат"
          >
            <HelpCircle size={20} />
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className={`w-10 h-10 rounded-sm border-2 flex items-center justify-center transition-colors cursor-pointer ${
              isAudioMuted
                ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                : 'bg-[#2D2D2D] hover:bg-[#3D3D3D] border-[#555555] text-white'
            }`}
            title={isAudioMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
          >
            {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 pt-3 flex flex-col">
        {/* Core Lesson Rule Banner */}
        <div className="mb-3 bg-[#1C1C1C] border-2 border-[#3D3D3D] rounded-sm p-2 sm:p-2.5 text-center text-xs sm:text-sm text-slate-200 shadow-md">
          <span className="font-bold text-amber-400">💡 Пам'ятка класу: </span>
          <span>Координата — це адреса блоку. </span>
          <span className="font-bold text-amber-300">X — крок вправо ➔, </span>
          <span className="font-bold text-cyan-300">Z — крок вниз ⬇, </span>
          <span className="font-bold text-[#55FF55]">Y — висота від землі ⬆.</span>
        </div>

        {level === 'results' ? (
          <ResultsScreen stats={stats} onRestart={handleRestartGame} />
        ) : (
          <div className="flex flex-col gap-4">
            {/* Level & Round Header Card */}
            <div className="bg-[#1C1C1C] rounded-sm p-3.5 border-2 border-[#3D3D3D] shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-400 text-black rounded-xs text-xs font-black uppercase">
                      Рівень {level} з 3
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      {level === 1 && '«Порятунок мобів» (Вид зверху: X і Z)'}
                      {level === 2 && '«Висота Y та Ендермен» (Вид збоку: X і Y)'}
                      {level === 3 && '«Компас шукача та Кріпер» (Радар: X і Z)'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {level === 1 && 'Моб застряг на карті! Діти називають координати X і Z, вчитель вводить і запускає сніжку!'}
                    {level === 2 && 'Ендермен на скелі або в небі! Визначаємо горизонталь X та висоту Y від землі (Y=0)!'}
                    {level === 3 && 'Кріпер сховався в траві! Компас підказує «більше/менше», а карта відсікає туманом зайві зони! До 6 спроб!'}
                  </p>
                </div>

                {/* Round Tracker (3 rounds per level) */}
                <div className="flex items-center gap-2 self-start sm:self-auto bg-[#141414] px-3 py-1.5 rounded-sm border border-[#333333]">
                  <span className="text-xs text-slate-400 font-bold">Раунд:</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((r) => {
                      const isPast = r < round;
                      const isCurrent = r === round;
                      return (
                        <div
                          key={r}
                          className={`w-7 h-7 rounded-xs font-mono text-xs font-black flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-amber-400 text-black scale-110 shadow-md border-2 border-white'
                              : isPast
                              ? 'bg-[#388E3C] text-white border border-[#2E7D32]'
                              : 'bg-[#292929] text-slate-500 border border-[#444444]'
                          }`}
                        >
                          {r}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Grid and Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Grid Column */}
              <div className="lg:col-span-7 flex flex-col items-center">
                {level === 1 && (
                  <TopViewGrid
                    target={l1Target}
                    previewX={inputX}
                    previewZ={inputZ}
                    lastShot={l1LastShot}
                    levelMode={1}
                    roundNumber={round}
                  />
                )}

                {level === 2 && (
                  <SideViewGrid
                    target={l2Target}
                    previewX={inputX}
                    previewY={inputY}
                    lastShot={l2LastShot}
                  />
                )}

                {level === 3 && (
                  <TopViewGrid
                    target={l3Target}
                    revealTarget={l3Revealed}
                    previewX={inputX}
                    previewZ={inputZ}
                    radarAttempts={l3Attempts}
                    levelMode={3}
                  />
                )}
              </div>

              {/* Controls Column */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {/* Steppers */}
                <CoordinateStepper
                  label="крок вправо ➔"
                  axis="X"
                  value={inputX}
                  onChange={setInputX}
                  disabled={roundCompleted}
                />

                {level === 2 ? (
                  <CoordinateStepper
                    label="висота від землі ⬆"
                    axis="Y"
                    value={inputY}
                    onChange={setInputY}
                    disabled={roundCompleted}
                  />
                ) : (
                  <CoordinateStepper
                    label="крок вниз ⬇"
                    axis="Z"
                    value={inputZ}
                    onChange={setInputZ}
                    disabled={roundCompleted}
                  />
                )}

                {/* Level 3 Heart HP counter for attempts */}
                {level === 3 && (
                  <div className="flex items-center justify-between px-3 py-2 bg-[#1A1A1A] rounded-sm border border-[#333333]">
                    <span className="text-xs text-slate-300 font-bold">Спроби розвідки:</span>
                    <MinecraftHearts heartsCount={6 - l3Attempts.length} maxHearts={6} />
                  </div>
                )}

                {/* Big Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (level === 1) handleLevel1Shot();
                    if (level === 2) handleLevel2Shot();
                    if (level === 3) handleLevel3Shot();
                  }}
                  disabled={roundCompleted}
                  className={`min-h-[54px] h-14 w-full rounded-sm font-black text-lg tracking-wider uppercase transition-all select-none shadow-xl flex items-center justify-center gap-2 cursor-pointer touch-manipulation ${
                    roundCompleted
                      ? 'bg-[#292929] text-slate-600 border-2 border-[#3D3D3D] cursor-not-allowed opacity-60'
                      : 'bg-[#388E3C] hover:bg-[#4CAF50] active:bg-[#1B5E20] text-white border-2 border-[#81C784] shadow-emerald-950/60 active:scale-95'
                  }`}
                >
                  <span>{level === 1 ? '❄️ Кинути сніжку!' : level === 2 ? '🏹 Постріл з лука!' : '🧭 Сканувати компасом!'}</span>
                </button>

                {/* Immediate Feedback Banner */}
                {feedbackMessage && (
                  <div
                    className={`p-3.5 rounded-sm border-2 transition-all shadow-lg animate-in fade-in duration-150 ${
                      isFeedbackPositive
                        ? 'bg-[#1B5E20]/90 border-[#4CAF50] text-lime-200'
                        : 'bg-[#B71C1C]/90 border-[#EF5350] text-rose-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl leading-none">
                        {isFeedbackPositive ? '✨' : '⚠️'}
                      </span>
                      <div className="flex-1">
                        <div className="font-black text-sm uppercase tracking-wide">
                          {isFeedbackPositive ? 'Влучно!' : 'Підказка класу:'}
                        </div>
                        <p className="text-xs sm:text-sm mt-0.5 leading-relaxed font-bold">
                          {feedbackMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Round Button */}
                {roundCompleted && (
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="min-h-[52px] h-14 w-full rounded-sm font-black text-base sm:text-lg bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-black border-2 border-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 touch-manipulation uppercase"
                  >
                    <span>{round < 3 ? 'Наступний раунд' : typeof level === 'number' && level < 3 ? 'Наступний рівень ➔' : 'Показати результати 📜'}</span>
                    <ArrowRight size={20} />
                  </button>
                )}

                {/* Keyboard Shortcut Hint for Teacher */}
                <div className="mt-1 text-center text-[10px] text-slate-500">
                  ⌨️ Вчителю: <kbd className="bg-black px-1 py-0.5 rounded text-slate-300">Стрілки</kbd> змінюють координати, <kbd className="bg-black px-1 py-0.5 rounded text-slate-300">Пробіл</kbd> — постріл, <kbd className="bg-black px-1 py-0.5 rounded text-slate-300">Enter</kbd> — далі.
                </div>
              </div>
            </div>

            {/* Bottom Minecraft Hotbar Display */}
            <div className="mt-2 flex justify-center">
              <MinecraftHotbar activeIndex={level === 1 ? 1 : level === 2 ? 0 : 2} />
            </div>
          </div>
        )}
      </main>

      {/* Rules Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1F1F1F] border-4 border-[#555555] rounded-sm p-5 sm:p-6 max-w-lg w-full shadow-2xl text-slate-200 relative">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#333333]">
              <h3 className="text-lg font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                <span>📖</span>
                <span>Як працюють координати в Minecraft?</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-sm bg-[#333333] hover:bg-[#444444] text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs sm:text-sm leading-relaxed">
              <div className="p-2.5 rounded-sm bg-amber-950/40 border border-amber-500/40 flex items-start gap-2">
                <span className="font-mono font-black text-amber-400 text-base">X</span>
                <div>
                  <span className="font-bold text-amber-300">Горизонталь: </span>
                  кроки вправо від 0 до 9. Більший X — це <span className="underline font-bold">правіше ➔</span>.
                </div>
              </div>

              <div className="p-2.5 rounded-sm bg-cyan-950/40 border border-cyan-500/40 flex items-start gap-2">
                <span className="font-mono font-black text-cyan-400 text-base">Z</span>
                <div>
                  <span className="font-bold text-cyan-300">Вид зверху (глибина): </span>
                  кроки вниз від 0 до 9. Більший Z — це <span className="underline font-bold">нижче ⬇</span>.
                </div>
              </div>

              <div className="p-2.5 rounded-sm bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-2">
                <span className="font-mono font-black text-[#55FF55] text-base">Y</span>
                <div>
                  <span className="font-bold text-[#55FF55]">Висота (вид збоку): </span>
                  кроки вгору від землі. <span className="underline font-bold">Рівень землі — це Y = 0</span>. Більший Y — це <span className="underline font-bold">вище ⬆</span>.
                </div>
              </div>

              <div className="p-2 bg-[#141414] rounded-sm text-xs text-slate-300 border border-[#333333]">
                ⭐ <strong className="text-white">Початок координат (0, 0)</strong> завжди в лівому верхньому куті карти!
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-sm text-sm transition-colors cursor-pointer uppercase"
            >
              Зрозуміло, повертаємося до гри!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
