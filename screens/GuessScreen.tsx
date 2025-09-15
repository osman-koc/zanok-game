import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Lightbulb, ArrowLeft, X } from 'lucide-react-native';
import Hangman from '../components/Hangman';
import AnimatedFeedback from '../components/AnimatedFeedback';
import { strings, formatString } from '../lib/i18n';
import { updateStats } from '../lib/storage';
import { equalsMeaning } from '../lib/text';
import { getHintText, calculateScore, getInitialLives } from '../lib/game';
import { soundManager } from '../lib/sound';
import { useGameSession } from '../lib/gameSession';

export default function GuessScreen() {
  const params = useLocalSearchParams();
  const { currentRound, updateRound, completeRound, session, startSingleRound, addRound, endSession } = useGameSession();
  const [userInput, setUserInput] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintText, setHintText] = useState('');
  
  const isSessionMode = params.sessionMode === 'true';
  const continueSession = params.continueSession === 'true';
  
  useEffect(() => {
    if (!isSessionMode && !currentRound) {
      // Start a single round for non-session mode
      startSingleRound();
    } else if (continueSession && session && !currentRound) {
      // Continue session by adding a new round
      const roundData = addRound();
      if (!roundData) {
        // No more words available, end session
        endSession();
        router.push('/');
      }
    }
  }, [isSessionMode, continueSession, currentRound, session, startSingleRound, addRound, endSession]);
  

  
  // Reset states when round changes
  useEffect(() => {
    if (currentRound) {
      setUserInput('');
      setGameEnded(false);
      setFeedback({ type: null, message: '' });
      setShowHintModal(false);
      setHintText('');
    }
  }, [currentRound?.word.id]);
  
  if (!currentRound) {
    return null;
  }
  
  const word = currentRound?.word;
  const modifiers = currentRound?.modifiers || { hasHint: false, hasDoubleScore: false, hasExtraLife: false };
  const wrongAttempts = currentRound ? (getInitialLives(modifiers) - currentRound.livesRemaining) : 0;
  const hintUsed = currentRound?.hintUsed || false;
  const maxLives = getInitialLives(modifiers);



  const handleCheck = async () => {
    if (!word || gameEnded || !userInput.trim() || !currentRound) return;

    Keyboard.dismiss();
    
    const isCorrect = equalsMeaning(userInput.trim(), word.meaning);
    
    if (isCorrect) {
      await soundManager.playCorrectSound();
      const score = calculateScore(true, modifiers, hintUsed);
      await updateStats(true);
      setGameEnded(true);
      
      setFeedback({
        type: 'success',
        message: '✅ Doğru! Tebrikler!',
      });
      
      // Complete round and navigate after showing feedback
      setTimeout(() => {
        if (isSessionMode) {
          completeRound(score);
        }
        
        router.replace({
          pathname: '/result',
          params: isSessionMode ? {
            sessionMode: 'true',
          } : {
            won: 'true',
            score: score.toString(),
            word: word.term,
            meaning: word.meaning,
          },
        });
      }, 1500);
    } else {
      const newLivesRemaining = currentRound.livesRemaining - 1;
      updateRound({ livesRemaining: newLivesRemaining });
      
      await soundManager.playWrongSound();
      
      if (newLivesRemaining <= 0) {
        await updateStats(false);
        setGameEnded(true);
        
        setFeedback({
          type: 'error',
          message: formatString(strings.wrongAnswer, { answer: word.meaning }),
        });
        
        // Complete round and navigate after showing feedback
        setTimeout(() => {
          if (isSessionMode) {
            completeRound(0);
          }
          
          router.replace({
            pathname: '/result',
            params: isSessionMode ? {
              sessionMode: 'true',
            } : {
              won: 'false',
              score: '0',
              word: word.term,
              meaning: word.meaning,
            },
          });
        }, 2000);
      } else {
        setFeedback({
          type: 'error',
          message: '❌ Yanlış! Tekrar dene.',
        });
      }
      
      setUserInput('');
    }
  };

  const handleHint = () => {
    if (!word || hintUsed) return;
    
    const hint = getHintText(word.meaning);
    setHintText(hint);
    setShowHintModal(true);
  };

  const confirmHint = () => {
    if (currentRound) {
      updateRound({ hintUsed: true });
    }
    setShowHintModal(false);
  };

  const handleBackToHome = () => {
    if (isSessionMode && session) {
      router.push('/result');
    } else {
      router.push('/');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!word) return null;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{strings.guessTitle}</Text>
            
            <View style={styles.wordCard}>
              <Text style={styles.wordText}>{word.term}</Text>
              {modifiers.hasDoubleScore && (
                <View style={styles.modifier}>
                  <Text style={styles.modifierText}>⭐ Çift Puan</Text>
                </View>
              )}
              {modifiers.hasExtraLife && (
                <View style={styles.modifier}>
                  <Text style={styles.modifierText}>❤️ +1 Can</Text>
                </View>
              )}
            </View>

            <Hangman wrongAttempts={wrongAttempts} maxAttempts={maxLives} />
            
            <View style={styles.livesContainer}>
              <Text style={styles.livesText}>
                Kalan Can: {currentRound?.livesRemaining || maxLives}
              </Text>
            </View>
          </ScrollView>
          
          <View style={styles.bottomSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={strings.inputPlaceholder}
                placeholderTextColor="#999"
                value={userInput}
                onChangeText={setUserInput}
                editable={!gameEnded}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleCheck}
              />
              
              {!hintUsed && (
                <TouchableOpacity style={styles.hintButton} onPress={handleHint}>
                  <Lightbulb color="#FFA500" size={20} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.checkButton, gameEnded && styles.checkButtonDisabled]}
              onPress={handleCheck}
              disabled={gameEnded || !userInput.trim()}
            >
              <LinearGradient
                colors={gameEnded ? ['#ccc', '#999'] : ['#4CAF50', '#45a049']}
                style={styles.buttonGradient}
              >
                <Text style={styles.checkButtonText}>{strings.checkButton}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <AnimatedFeedback
          type={feedback.type}
          message={feedback.message}
          onComplete={() => setFeedback({ type: null, message: '' })}
        />

        <Modal
          visible={showHintModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowHintModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowHintModal(false)}
              >
                <X color="#666" size={20} />
              </TouchableOpacity>
              
              <View style={styles.modalHeader}>
                <Lightbulb color="#FFA500" size={32} />
                <Text style={styles.modalTitle}>İpucu</Text>
              </View>
              
              <Text style={styles.modalMessage}>
                İpucu kullanmak puanınızı düşürecek. Devam etmek istiyor musunuz?
              </Text>
              
              <Text style={styles.hintPreview}>{hintText}</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowHintModal(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmHint}
                >
                  <LinearGradient
                    colors={['#FFA500', '#FF8C00']}
                    style={styles.confirmButtonGradient}
                  >
                    <Text style={styles.confirmButtonText}>İpucu Al</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  wordCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  modifier: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 10,
  },
  modifierText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  livesContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  livesText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  hintButton: {
    padding: 8,
  },
  checkButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  hintPreview: {
    fontSize: 14,
    color: '#FFA500',
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 14,
  },
  confirmButton: {
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});