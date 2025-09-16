import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import Svg, {
  Path,
  Circle,
  Ellipse,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

type ZanPose = 'happy' | 'thinking' | 'encouraging' | 'neutral' | 'confused';
type ZanMessage = { text: string; duration?: number };

interface ZanMascotProps {
  pose?: ZanPose;
  message?: ZanMessage | null;
  position?: 'bottom-right' | 'bottom-left' | 'center';
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

export type { ZanPose, ZanMessage };

const PALETTE = {
  green: '#37B24D',      // gövde/baş
  greenShadow: '#2F9E44',
  yellow: '#FFD43B',     // göğüs
  beak: '#F4B400',       // gaga
  beakInner: '#E65A2E',  // gaga içi
  eyeWhite: '#FFF6E5',
  eyeBlack: '#23303E',
  redCrest: '#E74C3C',
  wing: '#1E88E5',
  wingDark: '#1565C0',
  tail: '#0EA5A5',
  feet: '#FF9727',
};

const SIZE = {
  small: { mascot: 60, bubble: 120 },
  medium: { mascot: 80, bubble: 160 },
  large: { mascot: 100, bubble: 200 },
} as const;

// Only create AnimatedG for native platforms to avoid web compatibility issues
const AnimatedG = Platform.OS !== 'web' ? Animated.createAnimatedComponent(G) : G;

export default function ZanMascot({
  pose = 'neutral',
  message = null,
  position = 'bottom-right',
  size = 'medium',
  animate = true,
}: ZanMascotProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const wingAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(0)).current;

  const currentSize = SIZE[size];

  useEffect(() => {
    if (!animate) return;
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -5, duration: 900, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    const wings = Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(wingAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    bounce.start(); wings.start();
    return () => { bounce.stop(); wings.stop(); };
  }, [animate, bounceAnim, wingAnim]);

  useEffect(() => {
    if (!message) { bubbleAnim.setValue(0); bubbleScale.setValue(0); return; }
    Animated.parallel([
      Animated.spring(bubbleScale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.timing(bubbleAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(bubbleAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(bubbleScale, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, [message, bubbleAnim, bubbleScale]);

  const getPositionStyle = () => {
    const base: any = { position: 'absolute', zIndex: 1000 };
    if (position === 'bottom-right') return { ...base, bottom: 20, right: 20 };
    if (position === 'bottom-left') return { ...base, bottom: 20, left: 20 };
    return { ...base, bottom: '30%', alignSelf: 'center' };
  };

  const renderZan = () => {
    const beakColor = pose === 'happy' ? '#FFC83A' : PALETTE.beak;
    const eyeScale = pose === 'thinking' ? 0.9 : 1;
    const wingRotate = wingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-12deg'],
    });

    return (
      <Animated.View
        style={[
          styles.mascotContainer,
          { transform: [{ translateY: bounceAnim }], width: currentSize.mascot, height: currentSize.mascot },
        ]}
      >
        {/* 100x100 viewbox, transparan arka plan */}
        <Svg width={currentSize.mascot} height={currentSize.mascot} viewBox="0 0 100 100">
          <Defs>
            {/* hafif parlaklık için beak highlight gradient */}
            <LinearGradient id="beakGloss" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
              <Stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* GÖVDE */}
          {/* ana gövde: sağa doğru oval, altta hafif gölge katmanı */}
          <Ellipse cx="54" cy="60" rx="24" ry="29" fill={PALETTE.green} />
          <Ellipse cx="54" cy="63" rx="22" ry="27" fill={PALETTE.greenShadow} opacity={0.18} />

          {/* GÖĞÜS (sarı dalga/scallop) */}
          <Path
            d="
              M 36 62
              C 42 55, 66 55, 72 62
              C 68 66, 62 69, 54 70
              C 46 69, 40 66, 36 62 Z
            "
            fill={PALETTE.yellow}
          />

          {/* BAŞ */}
          <Circle cx="52" cy="34" r="19" fill={PALETTE.green} />

          {/* İBİK (iki parça) */}
          <Path d="M 60 19 C 66 15, 70 17, 70 24 C 66 25, 63 23, 60 19 Z" fill={PALETTE.redCrest} />
          <Path d="M 54 20 C 59 16, 63 17, 64 23 C 60 24, 57 23, 54 20 Z" fill={PALETTE.redCrest} />

          {/* GAGA (büyük, parlak, sola bakıyor) */}
          <Path
            d="
              M 28 36
              C 30 28, 40 24, 48 27
              C 45 34, 40 37, 33 38
              C 31 38.5, 29.5 37.6, 28 36 Z
            "
            fill={beakColor}
          />
          {/* gaga içi */}
          <Path
            d="
              M 33 38
              C 37 37, 42 34, 45 29
              C 44 36, 40 39, 34 41 Z
            "
            fill={PALETTE.beakInner}
            opacity={0.85}
          />
          {/* beak gloss */}
          <Path
            d="
              M 31 33
              C 36 29, 43 28, 46 30
              C 41 31.5, 37 33.5, 33 35 Z
            "
            fill="url(#beakGloss)"
            opacity={0.7}
          />

          {/* TEK BÜYÜK GÖZ */}
          <Circle cx="56" cy="33" r={8.5} fill={PALETTE.eyeWhite} />
          <Circle cx="56" cy="33" r={4.6 * eyeScale} fill={PALETTE.eyeBlack} />
          <Circle cx="58" cy="31.5" r={1.6} fill="#FFFFFF" opacity={0.95} />

          {/* SAĞ KANAT (mavi, animasyonlu döndürme) */}
          {Platform.OS !== 'web' ? (
            <AnimatedG
              style={[
                styles.animatedWing,
                { transform: [{ rotate: wingRotate }] }
              ]}
            >
              <Path
                d="
                  M 58 52
                  C 66 46, 79 48, 82 58
                  C 80 66, 70 70, 60 64
                  C 58 61, 58 56, 58 52 Z
                "
                fill={PALETTE.wing}
              />
              <Path
                d="
                  M 64 58
                  C 70 55, 76 57, 78 60
                  C 74 64, 68 64, 64 62 Z
                "
                fill={PALETTE.wingDark}
                opacity={0.9}
              />
            </AnimatedG>
          ) : (
            <G>
              <Path
                d="
                  M 58 52
                  C 66 46, 79 48, 82 58
                  C 80 66, 70 70, 60 64
                  C 58 61, 58 56, 58 52 Z
                "
                fill={PALETTE.wing}
              />
              <Path
                d="
                  M 64 58
                  C 70 55, 76 57, 78 60
                  C 74 64, 68 64, 64 62 Z
                "
                fill={PALETTE.wingDark}
                opacity={0.9}
              />
            </G>
          )}

          {/* KUYRUK (kısa, teal) */}
          <Path
            d="M 75 64 C 79 64, 82 66, 83 70 C 78 70, 74 68, 72 66 Z"
            fill={PALETTE.tail}
            opacity={0.95}
          />

          {/* AYAKLAR (küçük, turuncu) */}
          <Ellipse cx="48" cy="86" rx="4" ry="2.7" fill={PALETTE.feet} />
          <Ellipse cx="60" cy="86" rx="4" ry="2.7" fill={PALETTE.feet} />
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
        <View
          style={[
            styles.speechTail,
            position.includes('right') ? styles.speechTailRight : styles.speechTailLeft,
          ]}
        />
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
  mascotContainer: { alignItems: 'center', justifyContent: 'center' },
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
  speechTailRight: { right: 20 },
  speechTailLeft: { left: 20 },
  animatedWing: {
    transformOrigin: '69 58',
  },
});