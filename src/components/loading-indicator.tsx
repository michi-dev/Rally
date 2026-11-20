import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

/** Zentrierter Spinner, solange die Daten aus dem Speicher geladen werden. */
export function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={Colors.accent}
        accessibilityLabel="Daten werden geladen"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
});
