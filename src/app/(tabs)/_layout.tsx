import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

const NEW_MATCH_BUTTON_SIZE = 48;

/** Eigene Tab-Leiste: Verlauf, Neues Match (+) und Statistik. */
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />

      <TabList style={[styles.bar, { paddingBottom: insets.bottom }]}>
        <TabTrigger name="history" href="/" style={styles.tab}>
          <Text style={styles.label}>Verlauf</Text>
        </TabTrigger>

        <TabTrigger
          name="new"
          href="/new-match"
          style={styles.newMatchButton}
          accessibilityLabel="Neues Match"
        >
          <Text style={styles.newMatchLabel}>+</Text>
        </TabTrigger>

        <TabTrigger name="stats" href="/statistics" style={styles.tab}>
          <Text style={styles.label}>Statistik</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  slot: {
    flexShrink: 1,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingTop: Spacing.two,
    marginBottom: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  tab: {
    padding: Spacing.two,
  },
  label: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.accent,
  },
  newMatchButton: {
    width: NEW_MATCH_BUTTON_SIZE,
    height: NEW_MATCH_BUTTON_SIZE,
    borderRadius: NEW_MATCH_BUTTON_SIZE / 2,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newMatchLabel: {
    color: Colors.textOnBrand,
    fontSize: 26,
    fontWeight: '600',
  },
});
