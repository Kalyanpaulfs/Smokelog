import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Breakpoints for responsive design
export const Breakpoints = {
  smallPhone: 375,
  largePhone: 414,
  tablet: 768,
};

export const Responsive = {
  isSmallPhone: width <= Breakpoints.smallPhone,
  isTablet: width >= Breakpoints.tablet,
  window: { width, height },
};

// Semantic Colors for a premium, calm, health-focused aesthetic
export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB', // Calm, slightly off-white surface
    surfaceHighlight: '#F3F4F6',
    primary: '#0F172A', // Deep, trustworthy slate black
    secondary: '#64748B', // Slate gray
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    danger: '#EF4444', // Red
    border: '#E2E8F0',
    divider: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    disabled: '#94A3B8',
    disabledBackground: '#F1F5F9',
    overlay: 'rgba(15, 23, 42, 0.4)',
    white: '#FFFFFF',
    black: '#000000',
  },
  dark: {
    background: '#0F172A', // Slate 900
    surface: '#1E293B', // Slate 800
    surfaceHighlight: '#334155', // Slate 700
    primary: '#FFFFFF', 
    secondary: '#94A3B8', // Slate 400
    success: '#34D399', // Emerald 400
    warning: '#FBBF24', // Amber 400
    danger: '#F87171', // Red 400
    border: '#334155',
    divider: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    disabled: '#475569',
    disabledBackground: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.6)',
    white: '#FFFFFF',
    black: '#000000',
  },
};

export type ThemeColors = typeof Colors.light;

export const Spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Typography Strategy: System Fonts
const systemFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  family: {
    regular: systemFont,
    medium: systemFont,
    semiBold: systemFont,
    bold: systemFont,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  sizes: {
    xs: 12, // Caption, Overline
    sm: 14, // Body small, Subtitle
    md: 16, // Body, Button
    lg: 20, // Title
    xl: 24, // Headline
    '2xl': 32, // Display
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 40,
  }
};

export const BorderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const Opacity = {
  active: 0.7,
  disabled: 0.5,
  overlay: 0.4,
};

export const IconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export const Elevation = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: Elevation.none,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: Elevation.sm,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Elevation.md,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: Elevation.lg,
  },
};

export const AnimationDurations = {
  fast: 150,
  normal: 250,
  slow: 400,
};
