import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import HeaderCard from '@/components/header-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getGames, getPlayers, type Game, type Player } from '@/lib/players-db';
import { computeStats } from '@/lib/stats';

export default function StatisticsScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        setPlayers(await getPlayers());
        setGames(await getGames());
      }
      load();
    }, []),
  );

  const stats = computeStats(players, games);

  return (
    <Screen>
      <HeaderCard
        logo="Rally"
        title="Statistik"
        subtitle={`Basierend auf ${stats.matchCount} Matches`}
      />
      <ThemedView type="backgroundElement" style={styles.card}> 
        <ThemedText type="smallBold">Matches: {stats.matchCount}</ThemedText>
        <ThemedText type="smallBold">Ø Sätze: {stats.avgSets.toFixed(1)}</ThemedText>
        <ThemedText type="smallBold">Decider: {stats.deciders}</ThemedText>
        {stats.ranking.map((row, index) => (
          <ThemedText key={row.player.id}>
            {index + 1}. {row.player.name}: {row.wins}/{row.played} ({Math.round(row.winRate * 100)}%)
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
