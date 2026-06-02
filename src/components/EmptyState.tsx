import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../theme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<Props> = ({ icon = 'planet', title, message }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconHalo, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={42} color={colors.primary} />
      </View>
      <Text style={[typography.title, { color: colors.text, textAlign: 'center', marginTop: spacing.lg }]}>
        {title}
      </Text>
      {message && (
        <Text
          style={[typography.body, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.xl }]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl * 2 },
  iconHalo: {
    width: 96,
    height: 96,
    borderRadius: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
