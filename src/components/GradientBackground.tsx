import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { Starfield } from './Starfield';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GradientBackground: React.FC<Props> = ({ children, style }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }, style]}>
      <LinearGradient
        colors={colors.gradient as unknown as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Starfield />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
});
