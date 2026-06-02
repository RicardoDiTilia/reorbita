import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { radius } from '../theme';

interface Props {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
  rounded?: number;
}

export const Skeleton: React.FC<Props> = ({ width = '100%', height = 16, style, rounded }) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1100 }), -1, true);
  }, [progress]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.35, 0.9]),
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: width as any,
          height,
          backgroundColor: colors.surfaceAlt,
          borderRadius: rounded ?? radius.sm,
        },
        aStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({ base: {} });
