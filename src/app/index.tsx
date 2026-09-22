import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HintRow } from '@/components/hint-row';
import { MatchForm } from '@/components/match-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { addPlayer, getPlayers, initDatabase, type Player } from '@/lib/players-db';
import HeaderCard from '../components/header-card';


export default function HomeScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    initDatabase().then(() => getPlayers().then(setPlayers));
  }, []);

  async function handleAddPlayer() {
    const name = newPlayerName.trim();
    if (!name) return;
    await addPlayer(name);
    setNewPlayerName('');
    setPlayers(await getPlayers());
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <HeaderCard
            logo="Rally"
            title="Matchverlauf"
            subtitle="Track your matches"
          />
        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          
          <ThemedText type="code" style={styles.code}>
            spieler
          </ThemedText>
          
          <TextInput
            value={newPlayerName}
            onChangeText={setNewPlayerName}
            placeholder="Name"
            style={styles.nameInput}
          />

          <Pressable onPress={handleAddPlayer} style={styles.addButton}>
            <ThemedView type="backgroundSelected" style={styles.addButtonInner}>
              <ThemedText type="smallBold">Spieler hinzufügen</ThemedText>
            </ThemedView>
          </Pressable>

          {players.map((player) => (
            <HintRow
              key={player.id}
              title={player.name}
              hint={<ThemedText type="code">{player.wins} wins / {player.games} games</ThemedText>}
            />
          ))}
        </ThemedView>

        <MatchForm players={players} />
  
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.none,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    marginVertical: Spacing.three,
    borderRadius: Spacing.four,
  },
  nameInput: {
    alignSelf: 'stretch',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8888',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  addButtonInner: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});
