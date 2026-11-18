import { Card } from '@/components/card';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useMatchData } from '@/hooks/use-match-data';
import { computeStats, type PlayerStat } from '@/lib/stats';

function formatRankingRow(row: PlayerStat, rank: number): string {
  const winPercent = Math.round(row.winRate * 100);
  return `${rank}. ${row.player.name}: ${row.wins}/${row.played} (${winPercent}%)`;
}

export default function StatisticsScreen() {
  const { players, games, error } = useMatchData();
  const stats = computeStats(players, games);

  return (
    <Screen>
      <HeaderCard title="Statistik" subtitle={`Basierend auf ${stats.matchCount} Matches`} />
      <ErrorMessage message={error} />
      <Card>
        <ThemedText type="smallBold">Matches: {stats.matchCount}</ThemedText>
        <ThemedText type="smallBold">Ø Sätze: {stats.avgSets.toFixed(1)}</ThemedText>
        <ThemedText type="smallBold">Decider: {stats.deciders}</ThemedText>
        {stats.ranking.map((row, index) => (
          <ThemedText key={row.player.id}>{formatRankingRow(row, index + 1)}</ThemedText>
        ))}
      </Card>
      <Card>
        <ThemedText type="smallBold">Satzverteilung</ThemedText>
        {stats.setDistribution.map((row) => (
          <ThemedText key={row.setCount} type="small">
            {row.setCount === 1 ? '1 Satz' : `${row.setCount} Sätze`}: {row.matchCount}
          </ThemedText>
        ))}
      </Card>
    </Screen>
  );
}
