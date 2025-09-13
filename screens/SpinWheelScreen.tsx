import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { Plus } from 'lucide-react-native';
import SpinWheel from '../components/SpinWheel';
import StatsBadge from '../components/StatsBadge';
import Logo from '../components/Logo';

import { strings } from '../lib/i18n';
import { getWords, getDailyStats } from '../lib/storage';
import { spinWheel, getRandomWord, createRoundModifiers } from '../lib/game';
import { soundManager } from '../lib/sound';
import { Word, WheelSegment, DailyStats } from '../types';

export default function SpinWheelScreen() {
  const [words, setWords] = useState<Word[]>([]);
  const [stats, setStats] = useState<DailyStats>({ date: '', correct: 0, wrong: 0, streak: 0 });
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | undefined>(undefined);
  const [lastWordId, setLastWordId] = useState<string>();

  useEffect(() => {
    loadData();
    initializeSound();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const initializeSound = async () => {
    await soundManager.initialize();
    // Background music disabled to avoid notification-like sounds
    // await soundManager.playBackgroundMusic();
  };

  const loadData = async () => {
    const [wordsData, statsData] = await Promise.all([
      getWords(),
      getDailyStats(),
    ]);
    setWords(wordsData);
    setStats(statsData);
  };

  const handleSpin = async () => {
    if (words.length === 0) {
      Alert.alert(strings.noWords, strings.addFirstWord, [
        { text: strings.addWords, onPress: () => router.push('/add-word') },
      ]);
      return;
    }

    if (isSpinning) return;

    await soundManager.playSpinSound();
    const segment = spinWheel();
    setSelectedSegment(segment);
    setIsSpinning(true);
  };

  const handleSpinComplete = (segment: WheelSegment) => {
    setIsSpinning(false);
    
    const word = getRandomWord(words, lastWordId);
    if (!word) return;

    setLastWordId(word.id);
    const modifiers = createRoundModifiers(segment);

    router.push({
      pathname: '/guess',
      params: {
        wordId: word.id,
        hasHint: modifiers.hasHint.toString(),
        hasDoubleScore: modifiers.hasDoubleScore.toString(),
        hasExtraLife: modifiers.hasExtraLife.toString(),
      },
    });
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo size="small" />
        </View>
        <View style={styles.menuButtons}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/word-list')}
          >
            <Text style={styles.menuButtonText}>Kelimeler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.menuButtonText}>Profil</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{strings.spinWheelTitle}</Text>
        </View>
        
        <View style={styles.wheelSection}>
          <SpinWheel
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
            selectedSegment={selectedSegment}
          />
          <StatsBadge stats={stats} inline={true} />
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
            onPress={handleSpin}
            disabled={isSpinning}
          >
            <LinearGradient
              colors={isSpinning ? ['#ccc', '#999'] : ['#4CAF50', '#45a049']}
              style={styles.buttonGradient}
            >
              <Text style={styles.spinButtonText}>
                {isSpinning ? '...' : strings.spinButton}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-word')}
          >
            <Plus color="white" size={20} />
            <Text style={styles.addButtonText}>{strings.addWords}</Text>
          </TouchableOpacity>
        </View>
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    gap: 12,
  },
  logoContainer: {
    alignItems: 'center',
  },
  menuButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  wheelSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  buttonSection: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 16,
  },
  spinButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spinButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});