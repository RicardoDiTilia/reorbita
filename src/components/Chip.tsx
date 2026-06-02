import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Chip: React.FC<Props> = ({ label, active, onPress, icon }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.93))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={[
        styles.base,
        {
          backgroundColor: active ? colors.primary : colors.surface,
          borderColor: active ? colors.primary : colors.border,
        },
        aStyle,
      ]}
    >
      {icon}
      <Text
        style={[
          typography.caption,
          { color: active ? '#fff' : colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
