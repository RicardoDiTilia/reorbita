import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius, spacing, typography } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export const Header: React.FC<Props> = ({ title, subtitle, onBack, right }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {onBack && (
        <Pressable
          onPress={onBack}
          style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        {subtitle && (
          <Text style={[typography.caption, { color: colors.textMuted, textTransform: 'uppercase' }]}>
            {subtitle}
          </Text>
        )}
        <Text style={[typography.title, { color: colors.text }]}>{title}</Text>
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
