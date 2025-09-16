import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, User } from 'lucide-react-native';
import SpinWheel from '@/components/SpinWheel';
import Logo from '@/components/Logo';
import ZanMascot from '@/components/ZanMascot';
import { useGameSession } from '@/lib/gameSession';
import { WheelSegment } from '../types';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isSpinning, setIsSpinning] = useState(false);
  const [zanMessage, setZanMessage] = useState<{ text: string; duration?: number } | null>(null);
  const { startNewSessionWithRound } = useGameSession();

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setZanMessage({ text: 'Hadi bakalım, çark dönüyor!', duration: 2000 });
  };

  const handleSpinComplete = (segment: WheelSegment) => {
    setIsSpinning(false);
    
    const result = startNewSessionWithRound();
    if (!result) {
      console.log('Error: Could not load words');
      setZanMessage({ text: 'Hmm, bir sorun var. Tekrar dene!', duration: 3000 });
      return;
    }

    setZanMessage({ text: 'Harika! Hadi kelime öğrenelim!', duration: 2000 });
    
    setTimeout(() => {
      router.push({
        pathname: '/guess',
        params: {
          sessionMode: 'true',
        },
      });
    }, 1500);
  };

  const handleQuickPlay = () => {
    router.push({
      pathname: '/guess',
      params: {
        sessionMode: 'false',
      },
    });
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.headerButton}>
          <User color="white" size={24} />
        </TouchableOpacity>
        
        <Logo />
        
        <TouchableOpacity onPress={() => router.push('/word-list')} style={styles.headerButton}>
          <BookOpen color="white" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Çarkı Çevir!</Text>
        <Text style={styles.subtitle}>Şansını dene ve kelime öğren</Text>
        
        <View style={styles.wheelContainer}>
          <SpinWheel isSpinning={isSpinning} onSpinComplete={handleSpinComplete} />
        </View>
        
        <TouchableOpacity
          style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
          onPress={handleSpin}
          disabled={isSpinning}
        >
          <LinearGradient
            colors={isSpinning ? ['#ccc', '#999'] : ['#FF6B6B', '#FF5252']}
            style={styles.buttonGradient}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? 'Çeviriyor...' : 'Çarkı Çevir'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickPlayButton} onPress={handleQuickPlay}>
          <Text style={styles.quickPlayText}>Hızlı Oyun</Text>
        </TouchableOpacity>
      </View>
      
      <ZanMascot 
        pose="encouraging" 
        message={zanMessage}
        position="bottom-right"
        size="medium"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  wheelContainer: {
    marginBottom: 40,
  },
  spinButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
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
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickPlayButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  quickPlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});