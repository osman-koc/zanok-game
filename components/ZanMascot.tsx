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
    const beakColor = pose === 'happy' ? '#FFD93B' : '#FFC107';
    
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
          {/* Body */}
          <Ellipse cx="50" cy="60" rx="25" ry="30" fill="#3CB371" />
          
          {/* Chest */}
          <Ellipse cx="50" cy="65" rx="18" ry="20" fill="#FFD93B" />
          
          {/* Head */}
          <Circle cx="50" cy="35" r="20" fill="#3CB371" />
          
          {/* Beak */}
          <Path d="M 35 35 Q 25 35 30 40 Q 35 38 35 35" fill={beakColor} />
          
          {/* Eyes */}
          <Circle cx="45" cy="30" r="4" fill="white" />
          <Circle cx="55" cy="30" r="4" fill="white" />
          <Circle cx="45" cy="30" r={2 * eyeScale} fill="black" />
          <Circle cx={pose === 'thinking' ? "54" : "55"} cy="30" r={2 * eyeScale} fill="black" />
          
          {/* Eye highlights */}
          <Circle cx="46" cy="29" r="1" fill="white" />
          <Circle cx={pose === 'thinking' ? "55" : "56"} cy="29" r="1" fill="white" />
          
          {/* Crest */}
          <Path d="M 45 15 Q 50 10 55 15 Q 52 18 50 16 Q 48 18 45 15" fill="#FF6B6B" />
          
          {/* Wings */}
          <G style={styles.leftWing}>
            <Ellipse cx="30" cy="50" rx="8" ry="15" fill="#1E90FF" />
            <Ellipse cx="28" cy="45" rx="4" ry="8" fill="#4169E1" />
          </G>
          
          <G style={styles.rightWing}>
            <Ellipse cx="70" cy="50" rx="8" ry="15" fill="#1E90FF" />
            <Ellipse cx="72" cy="45" rx="4" ry="8" fill="#4169E1" />
          </G>
          
          {/* Feet */}
          <Ellipse cx="45" cy="88" rx="3" ry="6" fill="#FF8C00" />
          <Ellipse cx="55" cy="88" rx="3" ry="6" fill="#FF8C00" />
          
          {/* Special pose effects */}
          {pose === 'encouraging' && (
            <Path d="M 75 25 L 80 20 L 85 25 L 80 30 Z" fill="#FFD93B" />
          )}
          
          {pose === 'thinking' && (
            <>
              <Circle cx="65" cy="20" r="2" fill="#87CEEB" opacity="0.7" />
              <Circle cx="70" cy="15" r="3" fill="#87CEEB" opacity="0.5" />
              <Circle cx="75" cy="10" r="4" fill="#87CEEB" opacity="0.3" />
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