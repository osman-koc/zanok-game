import React from 'react';
import { Image, StyleSheet } from 'react-native';

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
    <Image
      source={{ uri: 'https://r2-pub.rork.com/generated-images/375d22ba-100d-4b0a-8467-86c09d77222d.png' }}
      style={[styles.container, currentSize.container, styles.oval]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    // No background styling - transparent logo
  },
  oval: {
    borderRadius: 1000, // Large value to create oval/circular shape
    overflow: 'hidden',
  },
});