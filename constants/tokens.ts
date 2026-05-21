export type Theme = 'light' | 'dark';

export type ColorToken =
  | 'bg-canvas'
  | 'bg-elevated'
  | 'bg-overlay'
  | 'bg-highlight'
  | 'fg-primary'
  | 'fg-secondary'
  | 'fg-muted'
  | 'fg-inverse'
  | 'accent-bronze'
  | 'accent-marble'
  | 'accent-gold'
  | 'feedback-success'
  | 'feedback-warning'
  | 'feedback-error'
  | 'border-subtle'
  | 'border-strong'
  | 'divider';

export type TypographyFamilyToken = 'display' | 'body' | 'mono';

export type TypographySizeToken =
  | 'displayXL'
  | 'displayL'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyL'
  | 'body'
  | 'caption'
  | 'numericHero'
  | 'numericM';

export type TypographyWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';

export type TypographyLineHeightToken = 'tight' | 'snug' | 'normal' | 'relaxed';

export type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type SpacingToken = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const colors = {
  dark: {
    bg: { canvas: '#1A1715', elevated: '#252220', overlay: '#2F2B28', highlight: '#3D3733' },
    fg: { primary: '#F2EAE0', secondary: '#B8AB9B', muted: '#6E6457', inverse: '#1A1715' },
    accent: { bronze: '#C19A6B', marble: '#E8DED1', gold: '#D4AF7A' },
    feedback: { success: '#7FB069', warning: '#D4A574', error: '#C66D5A' },
    border: { subtle: '#3D3733', strong: '#5A4F44' },
    divider: '#2A2622',
  },
  light: {
    bg: { canvas: '#F5F0E8', elevated: '#FAF5ED', overlay: '#FFFFFF', highlight: '#EBE3D5' },
    fg: { primary: '#2A2520', secondary: '#5C5247', muted: '#8C8073', inverse: '#FAF5ED' },
    accent: { bronze: '#8B6F47', marble: '#B8AB9B', gold: '#B8935A' },
    feedback: { success: '#5A8B47', warning: '#B8853D', error: '#A05543' },
    border: { subtle: '#DDD3C2', strong: '#B8AB9B' },
    divider: '#E5DDD0',
  },
} as const;

export const typography = {
  family: { display: 'Fraunces', body: 'Inter', mono: 'Inter' },
  size: {
    displayXL: 48,
    displayL: 36,
    h1: 28,
    h2: 22,
    h3: 18,
    bodyL: 17,
    body: 15,
    caption: 13,
    numericHero: 72,
    numericM: 32,
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.0, snug: 1.2, normal: 1.4, relaxed: 1.5 },
} as const;

export const radius = {
  xs: 4,
  sm: 10,
  md: 18,
  lg: 28,
  xl: 36,
  full: 9999,
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
} as const;

export const easing = {
  sculpted: 'cubic-bezier(0.32, 0.72, 0.0, 1.0)',
  quick: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

export const duration = {
  instant: 100,
  micro: 150,
  normal: 300,
  expressive: 500,
  celebration: 800,
  tierTransition: 1200,
} as const;

export const shadows = {
  subtle: '0 1px 2px rgba(0,0,0,0.08)',
  card: '0 4px 12px rgba(0,0,0,0.12)',
  overlay: '0 12px 32px rgba(0,0,0,0.25)',
} as const;
