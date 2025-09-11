export interface Word {
  id: string;
  term: string;
  meaning: string;
  createdAt: number;
}

export interface DailyStats {
  date: string;
  correct: number;
  wrong: number;
  streak: number;
}

export interface WheelSegment {
  id: string;
  label: string;
  type: 'word' | 'hint' | 'double' | 'life' | 'empty';
  color: string;
  icon: string;
}

export interface RoundModifiers {
  hasHint: boolean;
  hasDoubleScore: boolean;
  hasExtraLife: boolean;
}

export interface GameRound {
  word: Word;
  modifiers: RoundModifiers;
  livesRemaining: number;
  hintUsed: boolean;
  score: number;
}

export interface Settings {
  soundEnabled: boolean;
}