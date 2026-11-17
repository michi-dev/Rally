import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';

type HeaderCardProps = {
  title: string;
  subtitle: string;
  logo?: string;
};

export function HeaderCard({ title, subtitle, logo = 'Rally' }: HeaderCardProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.five }]}>
      <Text style={styles.logo}>{logo}</Text>
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
  },
  logo: {
    color: Colors.textOnBrand,
    fontSize: 10,
  },
  title: {
    color: Colors.textOnBrand,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textOnBrandMuted,
    fontSize: 10,
  },
});
