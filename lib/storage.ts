import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word, DailyStats, Settings } from '../types';

const STORAGE_KEYS = {
  WORDS: 'words',
  DAILY_STATS: 'dailyStats',
  SETTINGS: 'settings',
  TOTAL_STATS: 'totalStats',
} as const;

const DEFAULT_WORDS: Word[] = [
  { id: '1', term: 'elma', meaning: 'apple', createdAt: Date.now() },
  { id: '2', term: 'kitap', meaning: 'book', createdAt: Date.now() },
  { id: '3', term: 'ev', meaning: 'house', createdAt: Date.now() },
  { id: '4', term: 'araba', meaning: 'car', createdAt: Date.now() },
  { id: '5', term: 'su', meaning: 'water', createdAt: Date.now() },
  { id: '6', term: 'güneş', meaning: 'sun', createdAt: Date.now() },
  { id: '7', term: 'ay', meaning: 'moon', createdAt: Date.now() },
  { id: '8', term: 'yıldız', meaning: 'star', createdAt: Date.now() },
  { id: '9', term: 'deniz', meaning: 'sea', createdAt: Date.now() },
  { id: '10', term: 'dağ', meaning: 'mountain', createdAt: Date.now() },
];

export async function getWords(): Promise<Word[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.WORDS);
    if (data) {
      return JSON.parse(data);
    } else {
      // If no words exist, add default words
      await saveWords(DEFAULT_WORDS);
      return DEFAULT_WORDS;
    }
  } catch (error) {
    console.error('Error getting words:', error);
    return DEFAULT_WORDS;
  }
}

export async function saveWords(words: Word[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving words:', error);
  }
}

export async function addWord(term: string, meaning: string): Promise<boolean> {
  try {
    const words = await getWords();
    
    // Check for duplicates (case-insensitive)
    const exists = words.some(word => 
      word.term.toLowerCase() === term.toLowerCase()
    );
    
    if (exists) {
      return false;
    }
    
    const newWord: Word = {
      id: Date.now().toString(),
      term: term.trim(),
      meaning: meaning.trim(),
      createdAt: Date.now(),
    };
    
    words.push(newWord);
    await saveWords(words);
    return true;
  } catch (error) {
    console.error('Error adding word:', error);
    return false;
  }
}

export async function getDailyStats(): Promise<DailyStats> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STATS);
    const stats: DailyStats = data ? JSON.parse(data) : {
      date: today,
      correct: 0,
      wrong: 0,
      streak: 0,
    };
    
    // Reset if new day
    if (stats.date !== today) {
      const newStreak = stats.correct > 0 ? stats.streak + 1 : 0;
      const newStats: DailyStats = {
        date: today,
        correct: 0,
        wrong: 0,
        streak: newStreak,
      };
      await saveDailyStats(newStats);
      return newStats;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting daily stats:', error);
    const today = new Date().toISOString().split('T')[0];
    return { date: today, correct: 0, wrong: 0, streak: 0 };
  }
}

export async function saveDailyStats(stats: DailyStats): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving daily stats:', error);
  }
}

export async function updateStats(correct: boolean): Promise<DailyStats> {
  const stats = await getDailyStats();
  
  if (correct) {
    stats.correct += 1;
  } else {
    stats.wrong += 1;
  }
  
  await saveDailyStats(stats);
  await updateTotalStats(correct);
  return stats;
}

export async function getTotalStats(): Promise<{ totalCorrect: number; totalWrong: number }> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_STATS);
    return data ? JSON.parse(data) : { totalCorrect: 0, totalWrong: 0 };
  } catch (error) {
    console.error('Error getting total stats:', error);
    return { totalCorrect: 0, totalWrong: 0 };
  }
}

export async function saveTotalStats(stats: { totalCorrect: number; totalWrong: number }): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving total stats:', error);
  }
}

export async function updateTotalStats(correct: boolean): Promise<void> {
  const totalStats = await getTotalStats();
  
  if (correct) {
    totalStats.totalCorrect += 1;
  } else {
    totalStats.totalWrong += 1;
  }
  
  await saveTotalStats(totalStats);
}

export async function getSettings(): Promise<Settings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      soundEnabled: true,
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return { soundEnabled: true };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export async function updateWord(id: string, term: string, meaning: string): Promise<boolean> {
  try {
    const words = await getWords();
    const wordIndex = words.findIndex(word => word.id === id);
    
    if (wordIndex === -1) {
      return false;
    }
    
    // Check for duplicates (excluding current word)
    const exists = words.some((word, index) => 
      index !== wordIndex && word.term.toLowerCase() === term.toLowerCase()
    );
    
    if (exists) {
      return false;
    }
    
    words[wordIndex] = {
      ...words[wordIndex],
      term: term.trim(),
      meaning: meaning.trim(),
    };
    
    await saveWords(words);
    return true;
  } catch (error) {
    console.error('Error updating word:', error);
    return false;
  }
}

export async function deleteWord(id: string): Promise<void> {
  try {
    const words = await getWords();
    const filteredWords = words.filter(word => word.id !== id);
    await saveWords(filteredWords);
  } catch (error) {
    console.error('Error deleting word:', error);
  }
}

// Alias for addWord to match the import in add-word.tsx
export const addCustomWord = addWord;