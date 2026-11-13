import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text } from 'react-native';

import HeaderCard from '@/components/header-card';
import { Screen } from '@/components/screen';
import { getGames, getPlayers, initDatabase, type Game, type Player } from '@/lib/players-db';
import { computeStats } from '@/lib/stats';

export default function StatisticsScreen() {
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

  const stats = computeStats(players, games);

  return (
    <Screen>
      <HeaderCard
        logo="Rally"
        title="Statistik"
        subtitle={`Basierend auf ${stats.matchCount} Matches`}
      />
      <Text>Matches: {stats.matchCount}</Text>
      <Text>Ø Sätze: {stats.avgSets.toFixed(1)}</Text>
      <Text>Decider: {stats.deciders}</Text>
      {stats.ranking.map((row, index) => (
        <Text key={row.player.id}>
          {index + 1}. {row.player.name}: {row.wins}/{row.played} ({Math.round(row.winRate * 100)}%)
        </Text>
      ))}
    </Screen>
  );
}
