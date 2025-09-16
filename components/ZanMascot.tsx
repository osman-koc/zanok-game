import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

type ZanPose = 'happy' | 'thinking' | 'encouraging' | 'neutral' | 'confused';
type ZanMessage = {
  text: string;
  duration?: number;
};

interface ZanMascotProps {
  pose?: ZanPose;
  message?: ZanMessage | null;
  position?: 'bottom-right' | 'bottom-left' | 'center';
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

export default function ZanMascot({ 
  pose = 'neutral', 
  message = null, 
  position = 'bottom-right',
  size = 'medium',
  animate = true 
}: ZanMascotProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const wingAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;

  const sizeConfig = {
    small: { mascot: 60, bubble: 120 },
    medium: { mascot: 80, bubble: 160 },
    large: { mascot: 100, bubble: 200 }
  };

  const currentSize = sizeConfig[size];

  useEffect(() => {
    if (animate) {
      // Continuous bounce animation
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Wing flap animation
      const wingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(wingAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(wingAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      bounceAnimation.start();
      wingAnimation.start();

      return () => {
        bounceAnimation.stop();
        wingAnimation.stop();
      };
    }
  }, [animate, bounceAnim, wingAnim]);

  useEffect(() => {
    if (message) {
      // Speech bubble animation
      Animated.parallel([
        Animated.spring(bubbleScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const duration = message.duration || 3000;
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(bubbleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      bubbleAnim.setValue(0);
      bubbleScale.setValue(0);
    }
  }, [message, bubbleAnim, bubbleScale]);

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 1000,
    };

    switch (position) {
      case 'bottom-right':
        return { ...baseStyle, bottom: 20, right: 20 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 20, left: 20 };
      case 'center':
        return { ...baseStyle, bottom: '30%', alignSelf: 'center' };
      default:
        return { ...baseStyle, bottom: 20, right: 20 };
    }
  };

  const renderZan = () => {
    const eyeScale = pose === 'thinking' ? 0.8 : 1;
    const beakColor = pose === 'happy' ? '#FFD93B' : '#FFA500';
    
    return (
      <Animated.View 
        style={[
          styles.mascotContainer,
          { 
            transform: [{ translateY: bounceAnim }],
            width: currentSize.mascot,
            height: currentSize.mascot,
          }
        ]}
      >
        <Svg width={currentSize.mascot} height={currentSize.mascot} viewBox="0 0 100 100">
          {/* Main Body - Green oval */}
          <Ellipse cx="50" cy="55" rx="22" ry="28" fill="#4CAF50" />
          
          {/* Yellow chest area */}
          <Ellipse cx="50" cy="62" rx="16" ry="22" fill="#FFD93B" />
          
          {/* Head - Green circle */}
          <Circle cx="50" cy="32" r="18" fill="#4CAF50" />
          
          {/* Orange beak - curved like in icon */}
          <Path d="M 32 32 Q 22 32 25 38 Q 30 36 32 32" fill={beakColor} />
          <Path d="M 25 38 Q 28 40 32 38" fill="#FF6B35" />
          
          {/* Large white eyes with black pupils */}
          <Circle cx="42" cy="28" r="5" fill="#F5F5DC" />
          <Circle cx="58" cy="28" r="5" fill="#F5F5DC" />
          <Circle cx="42" cy="28" r={3 * eyeScale} fill="#2C3E50" />
          <Circle cx={pose === 'thinking' ? "57" : "58"} cy="28" r={3 * eyeScale} fill="#2C3E50" />
          
          {/* Eye highlights */}
          <Circle cx="43" cy="27" r="1.5" fill="white" />
          <Circle cx={pose === 'thinking' ? "58" : "59"} cy="27" r="1.5" fill="white" />
          
          {/* Red crest feathers on top */}
          <Path d="M 42 14 Q 45 8 48 14" fill="#FF5722" />
          <Path d="M 48 14 Q 50 8 52 14" fill="#FF5722" />
          <Path d="M 52 14 Q 55 8 58 14" fill="#FF5722" />
          
          {/* Blue wings - more detailed like in icon */}
          <G style={styles.leftWing}>
            <Ellipse cx="28" cy="48" rx="10" ry="18" fill="#2196F3" />
            <Ellipse cx="26" cy="42" rx="6" ry="12" fill="#1976D2" />
            <Path d="M 20 45 Q 18 50 20 55 Q 25 52 28 48" fill="#0D47A1" />
          </G>
          
          <G style={styles.rightWing}>
            <Ellipse cx="72" cy="48" rx="10" ry="18" fill="#2196F3" />
            <Ellipse cx="74" cy="42" rx="6" ry="12" fill="#1976D2" />
            <Path d="M 80 45 Q 82 50 80 55 Q 75 52 72 48" fill="#0D47A1" />
          </G>
          
          {/* Orange feet - more detailed */}
          <Ellipse cx="44" cy="82" rx="4" ry="8" fill="#FF9800" />
          <Ellipse cx="56" cy="82" rx="4" ry="8" fill="#FF9800" />
          <Path d="M 40 88 L 38 92 M 42 88 L 40 92 M 44 88 L 42 92" stroke="#FF9800" strokeWidth="2" fill="none" />
          <Path d="M 60 88 L 62 92 M 58 88 L 60 92 M 56 88 L 58 92" stroke="#FF9800" strokeWidth="2" fill="none" />
          
          {/* Special pose effects */}
          {pose === 'encouraging' && (
            <Path d="M 75 25 L 80 20 L 85 25 L 80 30 Z" fill="#FFD93B" />
          )}
          
          {pose === 'thinking' && (
            <>
              <Circle cx="65" cy="18" r="2" fill="#87CEEB" opacity="0.7" />
              <Circle cx="70" cy="13" r="3" fill="#87CEEB" opacity="0.5" />
              <Circle cx="75" cy="8" r="4" fill="#87CEEB" opacity="0.3" />
            </>
          )}
        </Svg>
      </Animated.View>
    );
  };

  const renderSpeechBubble = () => {
    if (!message) return null;

    return (
      <Animated.View
        style={[
          styles.speechBubble,
          {
            opacity: bubbleAnim,
            transform: [{ scale: bubbleScale }],
            width: currentSize.bubble,
            [position.includes('right') ? 'right' : 'left']: currentSize.mascot + 10,
            bottom: position === 'center' ? currentSize.mascot + 20 : currentSize.mascot - 10,
          },
        ]}
      >
        <Text style={styles.speechText}>{message.text}</Text>
        <View style={[
          styles.speechTail,
          position.includes('right') ? styles.speechTailRight : styles.speechTailLeft
        ]} />
      </Animated.View>
    );
  };

  return (
    <View style={getPositionStyle()}>
      {renderSpeechBubble()}
      {renderZan()}
    </View>
  );
}

const styles = StyleSheet.create({
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#3CB371',
  },
  speechText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  speechTail: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  speechTailRight: {
    right: 20,
  },
  speechTailLeft: {
    left: 20,
  },
  leftWing: {
    transformOrigin: '30 50',
  },
  rightWing: {
    transformOrigin: '70 50',
  },
});

export type { ZanPose, ZanMessage };