import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import ZanMascot from '../components/ZanMascot';
import { useGameSession } from '../lib/gameSession';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const { session, isComplete, endSession } = useGameSession();
  const [zanMessage, setZanMessage] = useState<{ text: string; duration?: number } | null>(null);
  const [zanPose, setZanPose] = useState<'happy' | 'thinking' | 'encouraging' | 'neutral' | 'confused'>('neutral');
  
  // Check if we're in session mode
  const isSessionMode = params.sessionMode === 'true';
  
  // Legacy mode (single game)
  const won = params.won === 'true';
  const score = parseInt(params.score as string) || 0;
  const word = params.word as string;
  const meaning = params.meaning as string;
  
  // Session mode - get the last completed round
  // If currentRoundIndex > 0, the last completed round is at currentRoundIndex - 1
  // If currentRoundIndex === 0, we might be looking at the first round that just completed
  const lastCompletedIndex = session ? Math.max(0, session.currentRoundIndex - 1) : 0;
  const currentRound = session?.rounds[lastCompletedIndex];
  
  // If we can't find the round at lastCompletedIndex, try the current index (for edge cases)
  const fallbackRound = session?.rounds[session.currentRoundIndex];
  const actualRound = currentRound || fallbackRound;
  
  const sessionWon = isSessionMode ? (actualRound?.score ?? 0) > 0 : won;
  const sessionScore = isSessionMode ? (actualRound?.score ?? 0) : score;
  const sessionWord = isSessionMode ? actualRound?.word.term : word;
  const sessionMeaning = isSessionMode ? actualRound?.word.meaning : meaning;
  const totalScore = session?.totalScore || 0;
  const roundNumber = lastCompletedIndex + 1; // Round number is 1-based
  
  useEffect(() => {
    if (sessionWon) {
      setZanPose('happy');
      if (isSessionMode && !isComplete) {
        setZanMessage({ text: 'Müthiş! Bir sonraki kelimeye hazır mısın?', duration: 4000 });
      } else if (isSessionMode && isComplete) {
        setZanMessage({ text: `Tebrikler! ${totalScore} puan topladın!`, duration: 5000 });
      } else {
        setZanMessage({ text: 'Harika! Başka kelimeler de öğrenelim!', duration: 4000 });
      }
    } else {
      setZanPose('encouraging');
      setZanMessage({ text: 'Sorun değil! Pratik yapmaya devam et!', duration: 4000 });
    }
  }, [sessionWon, isSessionMode, isComplete, totalScore]);

  // Show loading if we're in session mode but don't have the required data yet
  if (isSessionMode && (!session || !actualRound)) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Sonuç hazırlanıyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Show loading if we're in legacy mode but don't have the required data
  if (!isSessionMode && (!word || !meaning)) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Sonuç hazırlanıyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  const handleContinue = () => {
    if (isSessionMode && !isComplete) {
      // Navigate to guess screen, new round will be added there
      router.replace({
        pathname: '/guess',
        params: { 
          sessionMode: 'true',
          continueSession: 'true'
        }
      });
    } else {
      // Non-session mode: start a new random word
      router.replace({
        pathname: '/guess',
        params: { sessionMode: 'false' }
      });
    }
  };

  const handleBackToWheel = () => {
    if (isSessionMode) {
      endSession();
    }
    // Use replace to avoid navigation stack issues
    router.replace('/');
  };


  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.resultCard}>
          <View style={styles.stars}>
            {sessionWon && (
              <>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.star}>⭐</Text>
              </>
            )}
          </View>
          
          <Text style={styles.resultTitle}>
            {sessionWon ? 'Doğru!' : 'Yanlış!'}
          </Text>
          
          <Text style={styles.congratulations}>
            {isSessionMode ? `Round ${roundNumber} Tamamlandı` : (sessionWon ? 'Tebrikler!' : 'Tekrar Dene!')}
          </Text>
          
          {sessionScore > 0 && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{isSessionMode ? `Bu Round: +${sessionScore} puan` : `Puan: ${sessionScore}`}</Text>
            </View>
          )}
          
          {isSessionMode && (
            <View style={[styles.scoreContainer, styles.totalScoreContainer]}>
              <Text style={[styles.scoreText, styles.totalScoreText]}>Toplam Puan: {totalScore}</Text>
            </View>
          )}
          
          <View style={styles.wordInfo}>
            <Text style={styles.wordLabel}>Kelime:</Text>
            <Text style={styles.wordValue}>{sessionWord}</Text>
            <Text style={styles.meaningLabel}>Anlamı:</Text>
            <Text style={styles.meaningValue}>{sessionMeaning}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Devam Et</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleBackToWheel}>
            <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Çarka Dön</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      
      <ZanMascot 
        pose={zanPose} 
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    marginBottom: 40,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  star: {
    fontSize: 32,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  congratulations: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 12,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalScoreContainer: {
    backgroundColor: '#FF9800',
    marginBottom: 20,
  },
  totalScoreText: {
    fontSize: 20,
  },
  wordInfo: {
    alignItems: 'center',
    width: '100%',
  },
  wordLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  wordValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  meaningLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  meaningValue: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  buttons: {
    gap: 16,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
  },
});