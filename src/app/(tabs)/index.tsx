import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import HeaderCard from '@/components/header-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getGames, getPlayers, initDatabase, type Game, type Player } from '@/lib/players-db';
import { StyleSheet } from 'react-native';

export default function HistoryScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        await initDatabase();
        setPlayers(await getPlayers());
        setGames(await getGames());
      }
      load();
    }, []),
  );


  function nameOf(id: number) {
    return players.find((p) => p.id === id)?.name ?? 'Unbekannt';
  }

   return (
    <Screen>
      <HeaderCard logo="Rally" title="Matchverlauf" subtitle={`${games.length} Matches`} />
      <ThemedView type="backgroundElement" style={styles.card}>
        {[...games].reverse().map((game) => (
          <ThemedText key={game.id} type="small">
            {nameOf(game.p1_fk)} {game.sets.replace('/', ' : ')} {nameOf(game.p2_fk)} · {game.games}
          </ThemedText>
        ))}
      </ThemedView>
    </Screen>
  );
}


const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

