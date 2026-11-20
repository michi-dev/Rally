import { router } from 'expo-router';
import { useState } from 'react';

import { AddPlayerForm } from '@/components/add-player-form';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { LoadingIndicator } from '@/components/loading-indicator';
import { MatchForm } from '@/components/match-form';
import { PlayerList } from '@/components/player-list';
import { Screen } from '@/components/screen';
import { useMatchData } from '@/hooks/use-match-data';
import { addPlayer, deletePlayer, type Player } from '@/lib/database';
import type { BestOf } from '@/lib/tennis-scoring';

export default function NewMatchScreen() {
  const { players, isLoading, error: loadError, reload } = useMatchData();
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleAddPlayer(name: string) {
    try {
      await addPlayer(name);
      setSaveError(null);
      await reload();
    } catch {
      setSaveError('Spieler konnte nicht gespeichert werden.');
    }
  }

  async function handleDeletePlayer(playerId: number) {
    try {
      await deletePlayer(playerId);
      setSaveError(null);
      await reload();
    } catch {
      setSaveError('Spieler konnte nicht gelöscht werden.');
    }
  }

  function handleStartMatch(player1: Player, player2: Player, bestOf: BestOf) {
    router.push({
      pathname: '/match',
      params: {
        player1Id: String(player1.id),
        player2Id: String(player2.id),
        bestOf: String(bestOf),
      },
    });
  }

  return (
    <Screen>
      <HeaderCard title="Neues Match" subtitle="Spieler eingeben und starten" />
      <ErrorMessage message={loadError ?? saveError} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <MatchForm players={players} onStartMatch={handleStartMatch} />
          <AddPlayerForm players={players} onAddPlayer={handleAddPlayer} />
          <PlayerList players={players} onDeletePlayer={handleDeletePlayer} />
        </>
      )}
    </Screen>
  );
}
