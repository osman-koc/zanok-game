import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface AnimatedFeedbackProps {
  type: 'success' | 'error' | null;
  message: string;
  onComplete?: () => void;
}

export default function AnimatedFeedback({ type, message, onComplete }: AnimatedFeedbackProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type) {
      if (type === 'success') {
        // Success animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onComplete?.();
            });
          }, 2000);
        });
      } else if (type === 'error') {
        // Error shake animation
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
          ]),
        ]).start(() => {
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onComplete?.();
            });
          }, 2000);
        });
      }
    }
  }, [type]);

  if (!type) return null;

  const colors = type === 'success' 
    ? ['#4CAF50', '#45a049'] 
    : ['#f44336', '#d32f2f'];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <LinearGradient colors={colors} style={styles.feedback}>
        <Text style={styles.message}>{message}</Text>
        {type === 'success' && (
          <View style={styles.confetti}>
            <Text style={styles.confettiEmoji}>🎉</Text>
            <Text style={styles.confettiEmoji}>✨</Text>
            <Text style={styles.confettiEmoji}>🎊</Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
  },
  feedback: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 15,
    minWidth: width * 0.7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  confetti: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  confettiEmoji: {
    fontSize: 20,
  },
});