import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MatchCounter } from '@/components/match-counter';
import { MatchForm, type MatchFormat } from '@/components/match-form';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { getPlayers, initDatabase, type Player } from '@/lib/players-db';

type ActiveMatch = {
  player1: Player;
  player2: Player;
  format: MatchFormat;
};

export default function HomeScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);

  useEffect(() => {
    initDatabase().then(() => getPlayers().then(setPlayers));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {activeMatch ? (
          <MatchCounter
            player1={activeMatch.player1}
            player2={activeMatch.player2}
            format={activeMatch.format}
            onEndMatch={() => setActiveMatch(null)}
          />
        ) : (
          <MatchForm
            players={players}
            onStartMatch={(player1, player2, format) => setActiveMatch({ player1, player2, format })}
          />
        )}
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
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
});
