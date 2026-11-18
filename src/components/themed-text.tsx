import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, MonoFont } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: keyof typeof styles;
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  return <Text style={[{ color: Colors.text }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 800,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  code: {
    fontFamily: MonoFont,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
