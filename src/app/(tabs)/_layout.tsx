import { MaxContentWidth } from '@/constants/theme';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {

  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      {}
      <TabSlot style={styles.slot} />

      {/* Logik für Tab Navigation*/}
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

//Styling für Tab Navigation
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slot: {
    flexShrink: 1,                 
  },
 bar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  paddingTop: 8,
  width: '100%',               
  maxWidth: MaxContentWidth,   
  alignSelf: 'center',         
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
    borderRadius: 24,              
    backgroundColor: '#3AA3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusLabel: {
    color: '#FFFFFF',
    fontSize: 26,
  },
});

