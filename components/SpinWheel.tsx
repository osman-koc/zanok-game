import React, { useRef, useEffect } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';
import { WheelSegment } from '../types';
import { WHEEL_SEGMENTS, spinWheel } from '../lib/game';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.8, 300);
const RADIUS = WHEEL_SIZE / 2;
const CENTER = RADIUS;

interface SpinWheelProps {
  isSpinning: boolean;
  onSpinComplete: (segment: WheelSegment) => void;
}

export default function SpinWheel({ isSpinning, onSpinComplete }: SpinWheelProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  useEffect(() => {
    if (isSpinning) {
      const selectedSegment = spinWheel();
      const targetIndex = WHEEL_SEGMENTS.findIndex(s => s.id === selectedSegment.id);
      const targetAngle = 360 - (targetIndex * segmentAngle) + (segmentAngle / 2);
      const finalAngle = 360 * 3 + targetAngle; // 3 full rotations + target

      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: finalAngle,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        onSpinComplete(selectedSegment);
      });
    }
  }, [isSpinning]);

  const createSegmentPath = (index: number): string => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = CENTER + RADIUS * 0.9 * Math.cos(startAngle);
    const y1 = CENTER + RADIUS * 0.9 * Math.sin(startAngle);
    const x2 = CENTER + RADIUS * 0.9 * Math.cos(endAngle);
    const y2 = CENTER + RADIUS * 0.9 * Math.sin(endAngle);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS * 0.9} ${RADIUS * 0.9} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const textRadius = RADIUS * 0.65;
    return {
      x: CENTER + textRadius * Math.cos(angle),
      y: CENTER + textRadius * Math.sin(angle),
    };
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.wheel,
          {
            transform: [
              {
                rotate: spinValue.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS * 0.95}
            fill="white"
            stroke="#ddd"
            strokeWidth={4}
          />
          
          {WHEEL_SEGMENTS.map((segment, index) => {
            const textPos = getTextPosition(index);
            return (
              <G key={segment.id}>
                <Path
                  d={createSegmentPath(index)}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth={2}
                />
                <SvgText
                  x={textPos.x}
                  y={textPos.y - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="white"
                >
                  {segment.icon}
                </SvgText>
                <SvgText
                  x={textPos.x}
                  y={textPos.y + 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="white"
                >
                  {segment.label}
                </SvgText>
              </G>
            );
          })}
          
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={20}
            fill="white"
            stroke="#333"
            strokeWidth={3}
          />
        </Svg>
      </Animated.View>
      
      {/* Pointer - pointing down at the top of the wheel */}
      <View style={styles.pointer}>
        <View style={styles.pointerTriangle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheel: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pointer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -15,
    zIndex: 10,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});