import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { GameSession, Word, GameRound } from '../types';
import { 
  createGameSession, 
  addRoundToSession, 
  updateCurrentRound, 
  completeCurrentRound, 
  getCurrentRound, 
  isSessionComplete,
  getRandomWord,
  createRoundModifiers,
  spinWheel
} from './game';
import { getWords } from './storage';

export const [GameSessionProvider, useGameSession] = createContextHook(() => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [words, setWords] = useState<Word[]>([]);

  const loadWords = useCallback(async () => {
    const wordsData = await getWords();
    setWords(wordsData);
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const startNewSession = useCallback(() => {
    if (words.length === 0) return null;
    
    const newSession = createGameSession(words);
    setSession(newSession);
    return newSession;
  }, [words]);

  const startNewSessionWithRound = useCallback(() => {
    if (words.length === 0) return null;
    
    const newSession = createGameSession(words);
    const word = getRandomWord(words, []);
    if (!word) return null;
    
    const segment = spinWheel();
    const modifiers = createRoundModifiers(segment);
    
    const sessionWithRound = addRoundToSession(newSession, word, modifiers);
    setSession(sessionWithRound);
    
    return { session: sessionWithRound, word, modifiers, segment };
  }, [words]);

  const startSingleRound = useCallback(() => {
    if (words.length === 0) return null;
    
    // Create a temporary session for single round play
    const tempSession = createGameSession(words);
    const word = getRandomWord(words, []);
    if (!word) return null;
    
    // Use default modifiers for single round
    const modifiers = { hasHint: false, hasDoubleScore: false, hasExtraLife: false };
    
    const sessionWithRound = addRoundToSession(tempSession, word, modifiers);
    setSession(sessionWithRound);
    
    return { word, modifiers };
  }, [words]);

  const addRound = useCallback(() => {
    if (!session || words.length === 0) return null;
    
    const usedWordIds = session.rounds.map(round => round.word.id);
    const word = getRandomWord(words, usedWordIds);
    if (!word) return null;
    
    const segment = spinWheel();
    const modifiers = createRoundModifiers(segment);
    
    const updatedSession = addRoundToSession(session, word, modifiers);
    setSession(updatedSession);
    
    return { word, modifiers, segment };
  }, [session, words]);

  const updateRound = useCallback((updates: Partial<GameRound>) => {
    if (!session || !updates) return;
    
    const updatedSession = updateCurrentRound(session, updates);
    setSession(updatedSession);
  }, [session]);

  const completeRound = useCallback((score: number) => {
    if (!session || typeof score !== 'number') return;
    
    const updatedSession = completeCurrentRound(session, score);
    setSession(updatedSession);
  }, [session]);

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  const currentRound = useMemo(() => session ? getCurrentRound(session) : null, [session]);
  const isComplete = useMemo(() => session ? isSessionComplete(session) : false, [session]);

  return useMemo(() => ({
    session,
    currentRound,
    isComplete,
    words,
    startNewSession,
    startNewSessionWithRound,
    startSingleRound,
    addRound,
    updateRound,
    completeRound,
    endSession,
    loadWords,
  }), [session, currentRound, isComplete, words, startNewSession, startNewSessionWithRound, startSingleRound, addRound, updateRound, completeRound, endSession, loadWords]);
});

export function useCurrentGameRound() {
  const { currentRound } = useGameSession();
  return currentRound;
}