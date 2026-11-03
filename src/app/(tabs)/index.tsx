import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import HeaderCard from '@/components/header-card';
import { HintRow } from '@/components/hint-row';
import { MatchForm } from '@/components/match-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { addPlayer, getPlayers, initDatabase, type Player } from '@/lib/players-db';


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
      <ScrollView contentContainerStyle={styles.content}>
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
  
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
    paddingBottom: Spacing.three,
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
