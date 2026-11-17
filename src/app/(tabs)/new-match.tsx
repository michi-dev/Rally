import { useState } from 'react';

import { AddPlayerForm } from '@/components/add-player-form';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { MatchCounter, type MatchResult } from '@/components/match-counter';
import { MatchForm } from '@/components/match-form';
import { Screen } from '@/components/screen';
import { useMatchData } from '@/hooks/use-match-data';
import { addGame, addPlayer, type Player } from '@/lib/database';
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

  async function handleEndMatch(result: MatchResult | null) {
    if (result && activeMatch) {
      try {
        await addGame({
          player1Id: activeMatch.player1.id,
          player2Id: activeMatch.player2.id,
          ...result,
        });
        setSaveError(null);
      } catch {
        setSaveError('Match konnte nicht gespeichert werden.');
        return;
      }
    }
    setActiveMatch(null);
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
          onEndMatch={handleEndMatch}
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
        </>
      )}
    </Screen>
  );
}
