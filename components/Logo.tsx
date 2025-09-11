import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const sizeStyles = {
    small: {
      container: { width: 60, height: 60 },
      text: { fontSize: 20 },
    },
    medium: {
      container: { width: 80, height: 80 },
      text: { fontSize: 28 },
    },
    large: {
      container: { width: 120, height: 120 },
      text: { fontSize: 40 },
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <LinearGradient
      colors={['#F59E0B', '#F97316', '#EF4444']}
      style={[styles.container, currentSize.container]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.text, { fontSize: currentSize.text.fontSize }]}>
        Z
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});