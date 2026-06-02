import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  glow?: boolean;
  gradient?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<Props> = ({ children, style, onPress, glow, gradient = true }) => {
  const { colors, mode } = useTheme();
  const scale = useSharedValue(1);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const inner = gradient ? (
    <LinearGradient
      colors={colors.cardGradient as unknown as readonly [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        { borderColor: colors.border },
        glow && { shadowColor: colors.glow, shadowOpacity: 1, shadowRadius: 22, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  ) : (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return <View>{inner}</View>;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 15 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 12 }))}
      style={aStyle}
    >
      {inner}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
