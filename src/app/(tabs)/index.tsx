import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useMatchData } from '@/hooks/use-match-data';
import type { Player } from '@/lib/database';

function playerName(players: Player[], playerId: number): string {
  return players.find((player) => player.id === playerId)?.name ?? 'Gelöschter Spieler';
}

export default function HistoryScreen() {
  const { players, games, error } = useMatchData();
  const newestGamesFirst = [...games].reverse();

  return (
    <Screen>
      <HeaderCard title="Matchverlauf" subtitle={`${games.length} Matches`} />
      <ErrorMessage message={error} />

      {newestGamesFirst.length === 0 && (
        <Card>
          <ThemedText type="small">Noch keine Matches gespielt.</ThemedText>
        </Card>
      )}

      {newestGamesFirst.map((game) => {
        const name1 = playerName(players, game.player1Id);
        const name2 = playerName(players, game.player2Id);
        const player1Won = game.sets1 > game.sets2;

        return (
          <Card key={game.id}>
            <View style={styles.row}>
              <Avatar name={name1} color={Colors.accent} />
              <ThemedText type="smallBold" numberOfLines={1} style={styles.name}>
                {name1}
              </ThemedText>
              <Text style={[styles.sets, { color: player1Won ? Colors.win : Colors.text }]}>
                {game.sets1}
              </Text>
              <Text style={[styles.sets, { color: player1Won ? Colors.text : Colors.win }]}>
                {game.sets2}
              </Text>
              <ThemedText type="smallBold" numberOfLines={1} style={[styles.name, styles.right]}>
                {name2}
              </ThemedText>
              <Avatar name={name2} />
            </View>

            <View style={styles.footer}>
              <View style={styles.chips}>
                {game.setScores.map((set, index) => (
                  <Text key={index} style={styles.chip}>
                    {set.games1}:{set.games2}
                  </Text>
                ))}
              </View>
              <ThemedText type="label">
                {new Date(game.timestamp).toLocaleDateString('de-CH')}
              </ThemedText>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
  right: {
    textAlign: 'right',
  },
  sets: {
    fontSize: 24,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  chip: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    backgroundColor: Colors.track,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
