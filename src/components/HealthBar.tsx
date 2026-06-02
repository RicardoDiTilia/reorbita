import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../theme';

interface Props {
  label: string;
  value: number;
  icon?: React.ReactNode;
  critical?: number;
  warning?: number;
}

export const HealthBar: React.FC<Props> = ({ label, value, icon, critical = 30, warning = 60 }) => {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value, { duration: 900 });
  }, [value]);

  const aStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  const color =
    value < critical ? colors.danger : value < warning ? colors.warning : colors.success;

  return (
    <View style={{ marginBottom: spacing.md }}>
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {icon}
          <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase', fontWeight: '700' }]}>
            {label}
          </Text>
        </View>
        <Text style={[typography.subtitle, { color }]}>{Math.round(value)}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
        <Animated.View style={[styles.fillWrap, aStyle]}>
          <LinearGradient
            colors={[color, color + '99']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  track: { height: 8, borderRadius: 999, overflow: 'hidden' },
  fillWrap: { height: '100%', borderRadius: 999, overflow: 'hidden' },
});
