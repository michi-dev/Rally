import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Card } from '@/components/card';
import { PillButton, PillRow } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { Player } from '@/lib/database';

/** Längere Namen sprengen die Score-Anzeige und die Buttons im Live-Match. */
const MAX_NAME_LENGTH = 20;

type AddPlayerFormProps = {
  players: Player[];
  onAddPlayer: (name: string) => void;
};

export function AddPlayerForm({ players, onAddPlayer }: AddPlayerFormProps) {
  const [name, setName] = useState('');
  const trimmedName = name.trim();
  const nameExists = players.some(
    (player) => player.name.toLowerCase() === trimmedName.toLowerCase(),
  );
  const canAddPlayer = trimmedName.length > 0 && !nameExists;

  function handleAddPlayer() {
    if (!canAddPlayer) return;
    onAddPlayer(trimmedName);
    setName('');
  }

  return (
    <Card>
      <ThemedText type="small">Neuer Spieler</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleAddPlayer}
        placeholder="Name"
        placeholderTextColor={Colors.textPlaceholder}
        style={styles.input}
        maxLength={MAX_NAME_LENGTH}
        accessibilityLabel="Name des neuen Spielers"
      />
      <ThemedText type="label" style={styles.counter}>
        {`${trimmedName.length}/${MAX_NAME_LENGTH}`}
      </ThemedText>
      {nameExists && (
        <ThemedText style={styles.error} type="small">
          Diesen Spieler gibt es bereits.
        </ThemedText>
      )}
      <PillRow>
        <PillButton label="Spieler hinzufügen" onPress={handleAddPlayer} disabled={!canAddPlayer} />
      </PillRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderColor: Colors.track,
    color: Colors.text,
    fontSize: 16,
    backgroundColor: Colors.track,
  },
  counter: {
    alignSelf: 'flex-end',
  },
  error: {
    color: Colors.error,
  },
});
