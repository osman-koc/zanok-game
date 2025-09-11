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
      source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/l0dihm3bx7ajij5deddqc' }}
      style={[styles.container, currentSize.container]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});