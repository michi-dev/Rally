import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { LoadingIndicator } from '@/components/loading-indicator';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useMatchData } from '@/hooks/use-match-data';
import { computeStats } from '@/lib/stats';

export default function StatisticsScreen() {
  const { players, games, isLoading, error } = useMatchData();
  const stats = computeStats(players, games);

  const tiles = [
    { value: String(stats.matchCount), label: 'Matches', color: Colors.accent },
    { value: stats.avgSets.toFixed(1), label: 'Ø Sätze', color: Colors.win },
    { value: String(stats.deciders), label: 'Decider', color: Colors.brand },
  ];

  const distColors = [Colors.accent, Colors.win, Colors.brand];

  return (
    <Screen>
      <HeaderCard title="Statistik" subtitle={`Basierend auf ${stats.matchCount} Matches`} />
      <ErrorMessage message={error} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <View style={styles.tileRow}>
            {tiles.map((tile) => (
              <View key={tile.label} style={styles.tile}>
                <Text style={[styles.tileValue, { color: tile.color }]}>{tile.value}</Text>
                <ThemedText type="label">{tile.label}</ThemedText>
              </View>
            ))}
          </View>

          <Card>
            <ThemedText type="label">Spieler-Bilanz</ThemedText>
            {stats.ranking.length === 0 && (
              <ThemedText type="small">
                Noch keine Spieler erfasst. Lege unter «+» die ersten Spieler an.
              </ThemedText>
            )}
            {stats.ranking.map((row, index) => {
              const percent = Math.round(row.winRate * 100);
              const avatarColor = index === 0 ? Colors.accent : Colors.win;
              return (
                <View key={row.player.id} style={styles.row}>
                  <ThemedText type="label">{index + 1}</ThemedText>
                  <Avatar name={row.player.name} color={avatarColor} />
                  <View style={styles.middle}>
                    <ThemedText type="smallBold">{row.player.name}</ThemedText>
                    <View style={styles.barRow}>
                      <View style={styles.track}>
                        <View
                          style={[
                            styles.fill,
                            { width: `${percent}%`, backgroundColor: avatarColor },
                          ]}
                        />
                      </View>
                      <ThemedText type="label">{percent}%</ThemedText>
                    </View>
                  </View>
                  <ThemedText type="smallBold">
                    {row.wins}/{row.played}
                  </ThemedText>
                </View>
              );
            })}
          </Card>

          <Card>
            <ThemedText type="label">Satzverteilung</ThemedText>
            {stats.setDistribution.map((row) => {
              const percent = stats.matchCount > 0 ? (row.matchCount / stats.matchCount) * 100 : 0;
              return (
                <View key={row.setCount} style={styles.barRow}>
                  <ThemedText type="smallBold" style={styles.distLabel}>
                    {row.setCount === 1 ? '1 Satz' : `${row.setCount} Sätze`}
                  </ThemedText>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${percent}%`, backgroundColor: distColors[row.setCount - 1] },
                      ]}
                    />
                  </View>
                  <ThemedText type="smallBold">{row.matchCount}</ThemedText>
                </View>
              );
            })}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tileRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: Spacing.two,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.four,
    backgroundColor: Colors.backgroundElement,
    borderRadius: 20,
  },
  tileValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  middle: {
    flex: 1,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.track,
  },
  fill: {
    height: 5,
    borderRadius: 3,
  },
  distLabel: {
    width: 60,
  },
});
