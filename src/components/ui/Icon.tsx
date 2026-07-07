import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '../../hooks/use-theme';
import { IconSizes, ThemeColors } from '../../theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];

export interface IconProps {
  /** The name of the Feather icon */
  name: IconName;
  /** Size mapped to theme tokens or a direct number */
  size?: keyof typeof IconSizes | number;
  /** Color mapped to semantic theme tokens or a direct color string */
  color?: keyof ThemeColors | string;
}

/**
 * A centralized Icon wrapper over @expo/vector-icons/Feather.
 * Enforces usage of theme sizes and colors.
 */
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  color = 'textPrimary' 
}) => {
  const { colors } = useTheme();

  const iconSize = typeof size === 'number' ? size : IconSizes[size];
  // If the color matches a semantic key in our theme, use that. Otherwise use it as a raw string.
  const iconColor = colors[color as keyof ThemeColors] || color;

  return <Feather name={name} size={iconSize} color={iconColor} />;
};
