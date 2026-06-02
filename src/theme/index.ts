export type ThemeMode = 'light' | 'dark';

type PaletteShape = {
  bg: string; bgElevated: string; surface: string; surfaceAlt: string;
  border: string; text: string; textMuted: string;
  primary: string; primarySoft: string; accent: string;
  danger: string; success: string; warning: string;
  gradient: readonly [string, string, ...string[]];
  cardGradient: readonly [string, string, ...string[]];
  glow: string;
};

export const palette: Record<ThemeMode, PaletteShape> = {
  dark: {
    bg: '#06070D',
    bgElevated: '#0E1020',
    surface: '#141631',
    surfaceAlt: '#1B1E40',
    border: 'rgba(255,255,255,0.08)',
    text: '#F2F4FF',
    textMuted: '#8C90B8',
    primary: '#7C5CFF',
    primarySoft: 'rgba(124,92,255,0.18)',
    accent: '#22D3EE',
    danger: '#FF5C7A',
    success: '#22C55E',
    warning: '#F59E0B',
    gradient: ['#03040A', '#0A0B1F', '#160B33'] as const,
    cardGradient: ['#15183A', '#1E1750'] as const,
    glow: 'rgba(124,92,255,0.45)',
  },
  light: {
    bg: '#F4F5FB',
    bgElevated: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#EEF0FA',
    border: 'rgba(15,18,40,0.08)',
    text: '#0B0D24',
    textMuted: '#5A607F',
    primary: '#5B3DF5',
    primarySoft: 'rgba(91,61,245,0.10)',
    accent: '#0EA5E9',
    danger: '#E11D48',
    success: '#16A34A',
    warning: '#D97706',
    gradient: ['#E9ECFF', '#F4F5FB', '#FFFFFF'] as const,
    cardGradient: ['#FFFFFF', '#EEF0FA'] as const,
    glow: 'rgba(91,61,245,0.25)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  display: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.8 },
  title: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.4 },
};

export type Palette = PaletteShape;
