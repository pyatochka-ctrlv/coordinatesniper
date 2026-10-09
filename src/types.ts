export type GameMode = 1 | 2 | 3 | 'results';

export interface Point2D {
  x: number;
  z: number;
}

export interface PointSide {
  x: number;
  y: number;
}

export interface RadarAttempt {
  x: number;
  z: number;
  xHint: 'bigger' | 'smaller' | 'correct';
  zHint: 'bigger' | 'smaller' | 'correct';
}

export interface GameStats {
  levelScores: [number, number, number]; // 3 levels, each out of 3
  swappedXZCount: number;
  countedFromOneCount: number;
  heightYErrorCount: number;
  totalMisses: number;
  level3ShotsPerRound: number[];
}
