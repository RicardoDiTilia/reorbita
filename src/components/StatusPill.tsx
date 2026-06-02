import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HealthStatus } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { statusBg, statusColor, statusLabel } from '../theme/status';
import { radius, spacing, typography } from '../theme';

export const StatusPill: React.FC<{ status: HealthStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const { colors } = useTheme();
  const c = statusColor(status, colors);
  return (
    <View
      style={[
        styles.base,
        size === 'md' && { paddingVertical: 6, paddingHorizontal: 10 },
        { backgroundColor: statusBg(status), borderColor: c + '55' },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Text style={[typography.caption, { color: c, fontWeight: '700', textTransform: 'uppercase' }]}>
        {statusLabel[status]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 7, height: 7, borderRadius: 7 },
});
