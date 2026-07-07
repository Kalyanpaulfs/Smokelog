import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Typography } from '../../theme';

export type TextVariant = 
  | 'display'
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'overline'
  | 'button';

export interface TextProps extends RNTextProps {
  /** The typographic hierarchy variant */
  variant?: TextVariant;
  /** Explicit color override. Defaults to theme semantic colors. */
  color?: string;
  /** Text alignment */
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

/**
 * A highly reusable Text component that natively maps to the app's Typography hierarchy tokens.
 * Automatically supports Dynamic Font Scaling up to a reasonable max multiplier.
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'display':
        return {
          fontFamily: Typography.family.bold,
          fontWeight: Typography.weights.bold,
          fontSize: Typography.sizes['2xl'],
          lineHeight: Typography.lineHeights['2xl'],
        };
      case 'headline':
        return {
          fontFamily: Typography.family.bold,
          fontWeight: Typography.weights.bold,
          fontSize: Typography.sizes.xl,
          lineHeight: Typography.lineHeights.xl,
        };
      case 'title':
        return {
          fontFamily: Typography.family.semiBold,
          fontWeight: Typography.weights.semiBold,
          fontSize: Typography.sizes.lg,
          lineHeight: Typography.lineHeights.lg,
        };
      case 'subtitle':
        return {
          fontFamily: Typography.family.medium,
          fontWeight: Typography.weights.medium,
          fontSize: Typography.sizes.md,
          lineHeight: Typography.lineHeights.md,
        };
      case 'caption':
        return {
          fontFamily: Typography.family.regular,
          fontWeight: Typography.weights.regular,
          fontSize: Typography.sizes.sm,
          lineHeight: Typography.lineHeights.sm,
          color: colors.textSecondary,
        };
      case 'overline':
        return {
          fontFamily: Typography.family.semiBold,
          fontWeight: Typography.weights.semiBold,
          fontSize: Typography.sizes.xs,
          lineHeight: Typography.lineHeights.xs,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.textSecondary,
        };
      case 'button':
        return {
          fontFamily: Typography.family.semiBold,
          fontWeight: Typography.weights.semiBold,
          fontSize: Typography.sizes.md,
          lineHeight: Typography.lineHeights.md,
        };
      case 'body':
      default:
        return {
          fontFamily: Typography.family.regular,
          fontWeight: Typography.weights.regular,
          fontSize: Typography.sizes.md,
          lineHeight: Typography.lineHeights.md,
        };
    }
  };

  const variantStyle = getVariantStyle();
  const defaultColor = variantStyle.color || colors.textPrimary;

  return (
    <RNText
      style={[
        variantStyle,
        { color: color || defaultColor },
        align && { textAlign: align },
        style,
      ]}
      maxFontSizeMultiplier={1.35} // Accessibility: Restrict max scaling to avoid layout destruction
      {...props}
    />
  );
};
