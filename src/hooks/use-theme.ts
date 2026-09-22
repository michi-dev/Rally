/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';

/**
 * The app always renders in the light palette (white background, black
 * content) regardless of the system color scheme, for a clean, high
 * contrast, easy-to-read look.
 */
export function useTheme() {
  return Colors.light;
}
