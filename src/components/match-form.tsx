import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import type { Player } from '@/lib/players-db';

type MatchFormat = '1' | '3';

type MatchFormProps = {
  players: Player[];
};

export function MatchForm({ players }: MatchFormProps) {
  const [player1Id, setPlayer1Id] = useState<number | null>(null);
  const [player2Id, setPlayer2Id] = useState<number | null>(null);
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('3');

  const canStartMatch = player1Id !== null && player2Id !== null && player1Id !== player2Id;

  function handleStartMatch() {
    if (!canStartMatch) return;
    // TODO: navigate to the live match screen once it exists.
  }

  return (
    <ThemedView type="backgroundElement" style={styles.stepContainer}>
      <ThemedText type="code" style={styles.code}>
        match
      </ThemedText>

      <ThemedText type="small">Spieler 1</ThemedText>
      <ThemedView style={styles.pillRow}>
        {players.map((player) => (
          <Pressable key={player.id} onPress={() => setPlayer1Id(player.id)}>
            <ThemedView
              type={player.id === player1Id ? 'backgroundSelected' : 'backgroundElement'}
              style={styles.pill}
            >
              <ThemedText type="smallBold">{player.name}</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </ThemedView>

      <ThemedText type="small">Spieler 2</ThemedText>
      <ThemedView style={styles.pillRow}>
        {players.map((player) => (
          <Pressable key={player.id} onPress={() => setPlayer2Id(player.id)}>
            <ThemedView
              type={player.id === player2Id ? 'backgroundSelected' : 'backgroundElement'}
              style={styles.pill}
            >
              <ThemedText type="smallBold">{player.name}</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </ThemedView>

      <ThemedText type="small">Format</ThemedText>
      <ThemedView style={styles.pillRow}>
        <Pressable onPress={() => setMatchFormat('1')}>
          <ThemedView
            type={matchFormat === '1' ? 'backgroundSelected' : 'backgroundElement'}
            style={styles.pill}
          >
            <ThemedText type="smallBold">1 Satz</ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => setMatchFormat('3')}>
          <ThemedView
            type={matchFormat === '3' ? 'backgroundSelected' : 'backgroundElement'}
            style={styles.pill}
          >
            <ThemedText type="smallBold">3 Sätze</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>

      <Pressable onPress={handleStartMatch} disabled={!canStartMatch} style={styles.addButton}>
        <ThemedView
          type="backgroundSelected"
          style={[styles.addButtonInner, !canStartMatch && styles.addButtonDisabled]}
        >
          <ThemedText type="smallBold">Match starten</ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
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
  addButtonDisabled: {
    opacity: 0.4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});
