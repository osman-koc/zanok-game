import { Word, WheelSegment, RoundModifiers, GameSession, GameRound } from '../types';

export const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: '1', label: 'Kelime', type: 'word', color: '#FF6B6B', icon: '📝' },
  { id: '2', label: 'İpucu', type: 'hint', color: '#4ECDC4', icon: '💡' },
  { id: '3', label: 'Çift Puan', type: 'double', color: '#45B7D1', icon: '⭐' },
  { id: '4', label: '+1 Can', type: 'life', color: '#96CEB4', icon: '❤️' },
  { id: '5', label: 'Boş', type: 'empty', color: '#FFEAA7', icon: '😐' },
  { id: '6', label: 'Kelime', type: 'word', color: '#DDA0DD', icon: '📝' },
  { id: '7', label: 'İpucu', type: 'hint', color: '#98D8C8', icon: '💡' },
  { id: '8', label: 'Çift Puan', type: 'double', color: '#F7DC6F', icon: '⭐' },
];

// Store last used word IDs to prevent immediate repetition
let recentWordIds: string[] = [];
const RECENT_WORDS_BUFFER = 8; // Avoid repeating last 8 words

export function getRandomWord(words: Word[], usedWordIds: string[] = []): Word | null {
  if (words.length === 0) return null;
  
  console.log('getRandomWord called with:', {
    totalWords: words.length,
    usedWordIds: usedWordIds,
    recentWordIds: recentWordIds
  });
  
  // Combine used words in session with recently used words
  const allUsedIds = [...new Set([...usedWordIds, ...recentWordIds])];
  
  let availableWords = words;
  
  // Try to filter out used words if we have enough words left
  if (allUsedIds.length > 0 && words.length > allUsedIds.length) {
    availableWords = words.filter(word => !allUsedIds.includes(word.id));
    console.log('Filtered out all used words, available:', availableWords.length);
  }
  
  // If no words available after filtering, use words not in current session
  if (availableWords.length === 0 && usedWordIds.length > 0) {
    availableWords = words.filter(word => !usedWordIds.includes(word.id));
    console.log('Filtered out session words only, available:', availableWords.length);
  }
  
  // If still no words, reset and use all words except the very last one
  if (availableWords.length === 0) {
    const lastWordId = recentWordIds[recentWordIds.length - 1];
    availableWords = lastWordId 
      ? words.filter(word => word.id !== lastWordId)
      : words;
    console.log('Using all words except last, available:', availableWords.length);
  }
  
  // Ensure we have at least one word
  if (availableWords.length === 0) {
    availableWords = words;
    console.log('Emergency fallback: using all words');
  }
  
  // Use multiple random sources for better randomness
  const timestamp = Date.now();
  const random1 = Math.random();
  const random2 = Math.random();
  const combinedSeed = (timestamp + random1 * 1000000 + random2 * 1000000) % 1000000;
  const randomIndex = Math.floor((combinedSeed % availableWords.length));
  const selectedWord = availableWords[randomIndex];
  
  console.log('Word selection result:', {
    totalWords: words.length,
    usedInSession: usedWordIds.length,
    recentWords: recentWordIds.length,
    availableAfterFilter: availableWords.length,
    randomIndex: randomIndex,
    selectedWordId: selectedWord?.id,
    selectedWordTerm: selectedWord?.term,
    timestamp: timestamp,
    combinedSeed: combinedSeed
  });
  
  // Update recent words buffer
  if (selectedWord) {
    recentWordIds.push(selectedWord.id);
    if (recentWordIds.length > RECENT_WORDS_BUFFER) {
      recentWordIds.shift();
    }
    console.log('Updated recent words:', recentWordIds);
  }
  
  return selectedWord;
}

// Function to reset the recent words buffer (useful when starting a new session)
export function resetRecentWords(): void {
  recentWordIds = [];
}

export function spinWheel(): WheelSegment {
  const randomIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
  return WHEEL_SEGMENTS[randomIndex];
}

export function createRoundModifiers(segment: WheelSegment): RoundModifiers {
  return {
    hasHint: segment.type === 'hint',
    hasDoubleScore: segment.type === 'double',
    hasExtraLife: segment.type === 'life',
  };
}

export function calculateScore(
  correct: boolean,
  modifiers: RoundModifiers,
  hintUsed: boolean
): number {
  if (!correct) return 0;
  
  let score = 1;
  
  if (modifiers.hasDoubleScore) {
    score *= 2;
  }
  
  if (hintUsed) {
    score = Math.max(1, Math.floor(score * 0.5));
  }
  
  return score;
}

export function getInitialLives(modifiers: RoundModifiers): number {
  return modifiers.hasExtraLife ? 7 : 6;
}

export function getHintText(meaning: string): string {
  if (meaning.length === 0) return '';
  
  // For short words (≤3 chars), show first letter
  if (meaning.length <= 3) {
    return `${meaning[0]}...`;
  }
  
  // For medium words (4-6 chars), show first 2 letters
  if (meaning.length <= 6) {
    return `${meaning.substring(0, 2)}...`;
  }
  
  // For long words (>6 chars), show first 3 letters
  return `${meaning.substring(0, 3)}...`;
}

export function createGameSession(words: Word[]): GameSession {
  return {
    rounds: [],
    currentRoundIndex: 0,
    totalScore: 0,
    isActive: true,
    startedAt: Date.now(),
  };
}

export function addRoundToSession(session: GameSession, word: Word, modifiers: RoundModifiers): GameSession {
  const newRound: GameRound = {
    word,
    modifiers,
    livesRemaining: getInitialLives(modifiers),
    hintUsed: false,
    score: 0,
  };
  
  return {
    ...session,
    rounds: [...session.rounds, newRound],
  };
}

export function updateCurrentRound(session: GameSession, updates: Partial<GameRound>): GameSession {
  const updatedRounds = [...session.rounds];
  const currentRound = updatedRounds[session.currentRoundIndex];
  
  if (currentRound) {
    updatedRounds[session.currentRoundIndex] = {
      ...currentRound,
      ...updates,
    };
  }
  
  return {
    ...session,
    rounds: updatedRounds,
  };
}

export function completeCurrentRound(session: GameSession, score: number): GameSession {
  const updatedSession = updateCurrentRound(session, { score });
  
  return {
    ...updatedSession,
    totalScore: updatedSession.totalScore + score,
    currentRoundIndex: updatedSession.currentRoundIndex + 1,
  };
}

export function getCurrentRound(session: GameSession): GameRound | null {
  return session.rounds[session.currentRoundIndex] || null;
}

export function isSessionComplete(session: GameSession): boolean {
  return session.currentRoundIndex >= session.rounds.length;
}