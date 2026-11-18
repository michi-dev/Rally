import { router } from 'expo-router';
import { useState } from 'react';

import { AddPlayerForm } from '@/components/add-player-form';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { MatchCounter, type MatchResult } from '@/components/match-counter';
import { MatchForm } from '@/components/match-form';
import { PlayerList } from '@/components/player-list';
import { Screen } from '@/components/screen';
import { useMatchData } from '@/hooks/use-match-data';
import { addGame, addPlayer, deletePlayer, type Player } from '@/lib/database';
import type { BestOf } from '@/lib/tennis-scoring';

type ActiveMatch = {
  player1: Player;
  player2: Player;
  bestOf: BestOf;
};

export default function NewMatchScreen() {
  const { players, error: loadError, reload } = useMatchData();
  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);
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

  async function handleSaveMatch(result: MatchResult) {
    if (!activeMatch) return;
    try {
      await addGame({
        player1Id: activeMatch.player1.id,
        player2Id: activeMatch.player2.id,
        bestOf: activeMatch.bestOf,
        ...result,
      });
    } catch {
      setSaveError('Match konnte nicht gespeichert werden.');
      return;
    }
    setSaveError(null);
    setActiveMatch(null);
    router.navigate('/');
  }

  return (
    <Screen>
      <HeaderCard title="Neues Match" subtitle="Spieler eingeben und starten" />
      <ErrorMessage message={loadError ?? saveError} />
      {activeMatch ? (
        <MatchCounter
          player1={activeMatch.player1}
          player2={activeMatch.player2}
          bestOf={activeMatch.bestOf}
          onSaveMatch={handleSaveMatch}
          onCancelMatch={() => setActiveMatch(null)}
        />
      ) : (
        <>
          <MatchForm
            players={players}
            onStartMatch={(player1, player2, bestOf) =>
              setActiveMatch({ player1, player2, bestOf })
            }
          />
          <AddPlayerForm players={players} onAddPlayer={handleAddPlayer} />
          <PlayerList players={players} onDeletePlayer={handleDeletePlayer} />
        </>
      )}
    </Screen>
  );
}
