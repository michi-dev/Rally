import { useState } from 'react';

import { Card } from '@/components/card';
import { PillButton, PillRow } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import type { Player } from '@/lib/database';
import type { BestOf } from '@/lib/tennis-scoring';

const BEST_OF_OPTIONS: { value: BestOf; label: string }[] = [
  { value: 1, label: '1 Satz' },
  { value: 3, label: '3 Sätze' },
];

type MatchFormProps = {
  players: Player[];
  onStartMatch: (player1: Player, player2: Player, bestOf: BestOf) => void;
};

export function MatchForm({ players, onStartMatch }: MatchFormProps) {
  const [player1Id, setPlayer1Id] = useState<number | null>(null);
  const [player2Id, setPlayer2Id] = useState<number | null>(null);
  const [bestOf, setBestOf] = useState<BestOf>(3);

  const player1 = players.find((player) => player.id === player1Id);
  const player2 = players.find((player) => player.id === player2Id);
  const canStartMatch = !!player1 && !!player2 && player1.id !== player2.id;

  function handleStartMatch() {
    if (!canStartMatch) return;
    onStartMatch(player1, player2, bestOf);
  }

  return (
    <Card>
      {players.length < 2 && (
        <ThemedText type="small">Erfasse zuerst mindestens zwei Spieler.</ThemedText>
      )}

      <PlayerPicker
        label="Spieler 1"
        players={players}
        selectedId={player1Id}
        onSelect={setPlayer1Id}
      />
      <PlayerPicker
        label="Spieler 2"
        players={players}
        selectedId={player2Id}
        onSelect={setPlayer2Id}
      />

      <ThemedText type="label">Match-Format</ThemedText>
      <PillRow>
        {BEST_OF_OPTIONS.map((option) => (
          <PillButton
            key={option.value}
            label={option.label}
            muted={option.value !== bestOf}
            onPress={() => setBestOf(option.value)}
          />
        ))}
      </PillRow>

      <PillRow>
        <PillButton
          label="Match starten"
          strong
          onPress={handleStartMatch}
          disabled={!canStartMatch}
        />
      </PillRow>
    </Card>
  );
}

type PlayerPickerProps = {
  label: string;
  players: Player[];
  selectedId: number | null;
  onSelect: (playerId: number) => void;
};

function PlayerPicker({ label, players, selectedId, onSelect }: PlayerPickerProps) {
  return (
    <>
      <ThemedText type="label">{label}</ThemedText>
      <PillRow>
        {players.map((player) => (
          <PillButton
            key={player.id}
            label={player.name}
            muted={player.id !== selectedId}
            onPress={() => onSelect(player.id)}
          />
        ))}
      </PillRow>
    </>
  );
}
