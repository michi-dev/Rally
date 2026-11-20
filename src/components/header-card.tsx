import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';

type HeaderCardProps = {
  title: string;
  subtitle: string;
};

export function HeaderCard({ title, subtitle }: HeaderCardProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.five }]}>
      <Text style={styles.logo}>Rally</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderRadius: 16,
  },
  logo: {
    color: Colors.textOnBrand,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.textOnBrand,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textOnBrandMuted,
    fontSize: 13,
    fontWeight: '400',
  },
});
