import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Player } from '@/lib/database';

type PlayerListProps = {
  players: Player[];
  onDeletePlayer: (playerId: number) => void;
};

/**
 * Liste aller Spieler mit Löschen-Funktion. Gelöscht wird erst nach einer
 * Bestätigung (zweiter Klick), damit nicht aus Versehen ein Spieler verschwindet.
 */
export function PlayerList({ players, onDeletePlayer }: PlayerListProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  if (players.length === 0) return null;

  function handleConfirmDelete(playerId: number) {
    setPendingDeleteId(null);
    onDeletePlayer(playerId);
  }

  return (
    <Card>
      <ThemedText type="small">Spieler</ThemedText>
      {players.map((player) => (
        <View key={player.id} style={styles.row}>
          <ThemedText type="smallBold" style={styles.name}>
            {player.name}
          </ThemedText>
          {pendingDeleteId === player.id ? (
            <>
              <PillButton
                label="Wirklich löschen?"
                onPress={() => handleConfirmDelete(player.id)}
              />
              <PillButton label="Nein" muted onPress={() => setPendingDeleteId(null)} />
            </>
          ) : (
            <PillButton label="Löschen" muted onPress={() => setPendingDeleteId(player.id)} />
          )}
        </View>
      ))}
    </Card>
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
});
