import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
}

const makeStars = (count: number, w: number, h: number, seed: number): Star[] => {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rng() * w,
    y: rng() * h,
    r: rng() * 1.2 + 0.3,
    o: rng() * 0.5 + 0.2,
  }));
};

const TwinkleStar: React.FC<{ x: number; y: number; size: number; color: string; delay: number; duration: number }> = ({
  x,
  y,
  size,
  color,
  delay,
  duration,
}) => {
  const v = useSharedValue(0.2);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration }), -1, true));
  }, [v, delay, duration]);
  const aStyle = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ scale: 0.7 + v.value * 0.5 }] }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.twinkle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: color,
          shadowColor: color,
        },
        aStyle,
      ]}
    />
  );
};

export const Starfield: React.FC = () => {
  const { colors, mode } = useTheme();
  const dim = mode === 'dark' ? 1 : 0.45;

  const stars = useMemo(() => makeStars(110, SCREEN_W, SCREEN_H, 7), []);
  const twinkles = useMemo(() => {
    const rng = mulberry32(99);
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: rng() * SCREEN_W,
      y: rng() * SCREEN_H * 0.85,
      size: rng() * 2.5 + 1.5,
      delay: Math.floor(rng() * 2500),
      duration: 1400 + Math.floor(rng() * 1800),
    }));
  }, []);

  const starColor = mode === 'dark' ? '#FFFFFF' : '#5B3DF5';

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="nebula" cx="78%" cy="14%" r="55%">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={0.22 * dim} />
            <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="nebula2" cx="12%" cy="92%" r="50%">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.16 * dim} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={SCREEN_W * 0.78} cy={SCREEN_H * 0.14} r={SCREEN_W * 0.7} fill="url(#nebula)" />
        <Circle cx={SCREEN_W * 0.12} cy={SCREEN_H * 0.92} r={SCREEN_W * 0.6} fill="url(#nebula2)" />

        {/* anel orbital decorativo */}
        <Ellipse
          cx={SCREEN_W * 0.82}
          cy={SCREEN_H * 0.1}
          rx={140}
          ry={48}
          fill="none"
          stroke={colors.primary}
          strokeOpacity={0.18 * dim}
          strokeWidth={1}
        />
        <Ellipse
          cx={SCREEN_W * 0.82}
          cy={SCREEN_H * 0.1}
          rx={190}
          ry={66}
          fill="none"
          stroke={colors.accent}
          strokeOpacity={0.1 * dim}
          strokeWidth={1}
        />

        {stars.map((s, i) => (
          <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill={starColor} fillOpacity={s.o * dim} />
        ))}
      </Svg>

      {twinkles.map((t) => (
        <TwinkleStar
          key={t.id}
          x={t.x}
          y={t.y}
          size={t.size}
          color={starColor}
          delay={t.delay}
          duration={t.duration}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  twinkle: {
    position: 'absolute',
    shadowOpacity: 0.9,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
});
