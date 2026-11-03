import { MaxContentWidth } from '@/constants/theme';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  // How much space the phone needs at the bottom (e.g. the iPhone home bar)
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      {/* The current page (Verlauf, Neues Match or Statistik) shows here */}
      <TabSlot style={styles.slot} />

      {/* The bottom nav */}
      <TabList style={[styles.bar, { paddingBottom: insets.bottom }]}>
        <TabTrigger name="history" href="/" style={styles.tab}>
          <Text style={styles.label}>Verlauf</Text>
        </TabTrigger>

        <TabTrigger name="new" href="/new-match" style={styles.plus}>
          <Text style={styles.plusLabel}>+</Text>
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
    backgroundColor: '#FFFFFF',
  },
  slot: {
    flexShrink: 1,                 // let the page shrink so the ScrollView can scroll
  },
 bar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  paddingTop: 8,
  width: '100%',               // fill the screen on small phones…
  maxWidth: MaxContentWidth,   // …but never wider than the rest of the app
  alignSelf: 'center',         // and sit in the middle
  marginBottom: 8,
},
  tab: {
    padding: 10,
  },
  label: {
    fontSize: 20,
    color: '#3AA3B8',
  },
  plus: {
    width: 48,
    height: 48,
    borderRadius: 24,              // half of width → circle
    backgroundColor: '#3AA3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusLabel: {
    color: '#FFFFFF',
    fontSize: 26,
  },
});

