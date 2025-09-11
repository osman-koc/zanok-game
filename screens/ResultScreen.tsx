import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { strings } from '../lib/i18n';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const won = params.won === 'true';
  const score = parseInt(params.score as string) || 0;
  const word = params.word as string;
  const meaning = params.meaning as string;

  const handlePlayAgain = () => {
    router.push('/');
  };

  const handleAddWords = () => {
    router.push('/add-word');
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.resultCard}>
          <View style={styles.stars}>
            {won && (
              <>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.star}>⭐</Text>
              </>
            )}
          </View>
          
          <Text style={styles.resultTitle}>
            {won ? strings.youWon : strings.youLost}
          </Text>
          
          <Text style={styles.congratulations}>
            {won ? strings.congratulations : strings.tryAgain}
          </Text>
          
          {score > 0 && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Puan: {score}</Text>
            </View>
          )}
          
          <View style={styles.wordInfo}>
            <Text style={styles.wordLabel}>Kelime:</Text>
            <Text style={styles.wordValue}>{word}</Text>
            <Text style={styles.meaningLabel}>Anlamı:</Text>
            <Text style={styles.meaningValue}>{meaning}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handlePlayAgain}>
            <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{strings.playAgain}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleAddWords}>
            <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>{strings.addWords}</Text>
            </LinearGradient>
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
    marginBottom: 20,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
});