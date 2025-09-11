import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Path } from 'react-native-svg';

interface HangmanProps {
  wrongAttempts: number;
  maxAttempts?: number;
}

export default function Hangman({ wrongAttempts, maxAttempts = 6 }: HangmanProps) {
  const stages = [
    // Stage 0: Base
    () => <Line x1="20" y1="180" x2="80" y2="180" stroke="#8B4513" strokeWidth="4" />,
    // Stage 1: Pole
    () => <Line x1="50" y1="180" x2="50" y2="20" stroke="#8B4513" strokeWidth="4" />,
    // Stage 2: Top beam
    () => <Line x1="50" y1="20" x2="120" y2="20" stroke="#8B4513" strokeWidth="4" />,
    // Stage 3: Noose
    () => <Line x1="120" y1="20" x2="120" y2="40" stroke="#8B4513" strokeWidth="3" />,
    // Stage 4: Head
    () => <Circle cx="120" cy="55" r="15" stroke="#333" strokeWidth="3" fill="none" />,
    // Stage 5: Body
    () => <Line x1="120" y1="70" x2="120" y2="130" stroke="#333" strokeWidth="3" />,
    // Stage 6: Left arm
    () => <Line x1="120" y1="90" x2="100" y2="110" stroke="#333" strokeWidth="3" />,
    // Stage 7: Right arm
    () => <Line x1="120" y1="90" x2="140" y2="110" stroke="#333" strokeWidth="3" />,
    // Stage 8: Left leg
    () => <Line x1="120" y1="130" x2="100" y2="160" stroke="#333" strokeWidth="3" />,
    // Stage 9: Right leg
    () => <Line x1="120" y1="130" x2="140" y2="160" stroke="#333" strokeWidth="3" />,
  ];

  const visibleStages = Math.min(wrongAttempts + 1, stages.length);

  return (
    <View style={styles.container}>
      <Svg width="160" height="200" viewBox="0 0 160 200">
        {stages.slice(0, visibleStages).map((Stage, index) => (
          <Stage key={index} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});