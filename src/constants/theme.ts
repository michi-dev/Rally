/** Alle Farben der App. Die App hat bewusst nur ein helles Farbschema. */
export const Colors = {
  text: '#17485A',
  textMuted: '#9A9A8E',
  textPlaceholder: '#8A8A8A',
  textOnBrand: '#FFFFFF',
  textOnBrandMuted: '#90C4D8',
  error: '#B3261E',
  background: '#FFFFFF',
  backgroundElement: '#FFFFFF',
  backgroundScreen: '#E7E5D7',
  brand: '#17485A',
  accent: '#3AA3B8',
  win: '#8DB33A',
  track: '#EEEDE6',
} as const;

export type ThemeColor = keyof typeof Colors;

export const Spacing = {
  none: 0,
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
