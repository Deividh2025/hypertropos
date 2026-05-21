import React from 'react';
import { Text, TextProps } from 'react-native';
import { TypographySizeToken } from '../../constants/tokens';

export type TextColorVariant = 'primary' | 'secondary' | 'muted' | 'inverse' | 'bronze' | 'marble' | 'gold' | 'success' | 'warning' | 'error';
export type ExtendedTypographySizeToken = TypographySizeToken | 'bodyBold' | 'captionBold';

interface TextoProps extends TextProps {
  variant?: ExtendedTypographySizeToken;
  color?: TextColorVariant;
  children: React.ReactNode;
}

export function Texto({ variant = 'body', color = 'primary', className = '', style, ...props }: TextoProps) {
  const getTypographyClasses = (v: ExtendedTypographySizeToken) => {
    switch (v) {
      case 'displayXL': return 'font-display text-[48px] leading-[48px] font-medium';
      case 'displayL': return 'font-display text-[36px] leading-[43.2px] font-medium';
      case 'h1': return 'font-display text-[28px] leading-[36.4px] font-semibold';
      case 'h2': return 'font-display text-[22px] leading-[28.6px] font-semibold';
      case 'h3': return 'font-body text-[18px] leading-[25.2px] font-semibold';
      case 'bodyL': return 'font-body text-[17px] leading-[25.5px] font-normal';
      case 'body': return 'font-body text-[15px] leading-[22.5px] font-normal';
      case 'bodyBold': return 'font-body text-[15px] leading-[22.5px] font-semibold';
      case 'caption': return 'font-body text-[13px] leading-[18.2px] font-normal';
      case 'captionBold': return 'font-body text-[13px] leading-[18.2px] font-semibold';
      case 'numericHero': return 'font-mono text-[72px] leading-[72px] font-bold tracking-tight';
      case 'numericM': return 'font-mono text-[32px] leading-[32px] font-semibold';
      default: return 'font-body text-[15px] leading-[22.5px] font-normal';
    }
  };

  const colorMap: Record<TextColorVariant, string> = {
    primary: 'text-fg-primary',
    secondary: 'text-fg-secondary',
    muted: 'text-fg-muted',
    inverse: 'text-fg-inverse',
    bronze: 'text-accent-bronze',
    marble: 'text-accent-marble',
    gold: 'text-accent-gold',
    success: 'text-feedback-success',
    warning: 'text-feedback-warning',
    error: 'text-feedback-error',
  };

  const textClasses = [
    getTypographyClasses(variant),
    colorMap[color],
    className,
  ].filter(Boolean).join(' ');

  return <Text className={textClasses} style={style} {...props} />;
}
