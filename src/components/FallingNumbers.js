import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function NumberColumn({ left, delay, duration, height, color, fontSize }) {
  const anim = useRef(new Animated.Value(-200)).current;

  const digits = useMemo(() => {
    let s = '';
    for (let i = 0; i < 18; i++) {
      s += Math.floor(Math.random() * 10) + '\n';
    }
    return s.trim();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: height + 40,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -220,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay, duration, height]);

  return (
    <Animated.Text
      style={[
        styles.digit,
        {
          left,
          color,
          fontSize,
          transform: [{ translateY: anim }],
        },
      ]}
    >
      {digits}
    </Animated.Text>
  );
}

export default function FallingNumbers() {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  const columns = useMemo(() => {
    const count = Math.max(8, Math.floor(width / 40));
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        left: (i / count) * width + Math.random() * 10,
        delay: Math.random() * 4000,
        duration: 6000 + Math.random() * 7000,
        fontSize: 12 + Math.floor(Math.random() * 10),
        colorIndex: i % 3,
      });
    }
    return list;
  }, [width]);

  const palette = [colors.accent, colors.secondary, colors.primary];

  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      {columns.map((col) => (
        <NumberColumn
          key={col.id}
          left={col.left}
          delay={col.delay}
          duration={col.duration}
          height={height}
          fontSize={col.fontSize}
          color={palette[col.colorIndex]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    opacity: 0.22,
    zIndex: 0,
  },
  digit: {
    position: 'absolute',
    top: 0,
    fontFamily: 'Courier',
    lineHeight: 18,
    fontWeight: '700',
  },
});
