import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Card } from '@/components/card';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { LoadingIndicator } from '@/components/loading-indicator';
import { MatchCounter, type MatchResult } from '@/components/match-counter';
import { PillButton, PillRow } from '@/components/pill-button';
import { Screen } from '@/components/screen';
import { useMatchData } from '@/hooks/use-match-data';
import { addGame } from '@/lib/database';
import type { BestOf } from '@/lib/tennis-scoring';

type MatchParams = {
  player1Id: string;
  player2Id: string;
  bestOf: string;
};

function parseBestOf(value: string | undefined): BestOf {
  return value === '1' ? 1 : 3;
}

/** Zurück zum vorherigen Screen. Wurde /match direkt aufgerufen, gibt es keinen – dann zum Verlauf. */
function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

/** Live-Match: eigener Screen im Stack, damit die Zurück-Navigation (Geste, Browser, Android) greift. */
export default function MatchScreen() {
  const params = useLocalSearchParams<MatchParams>();
  const { players, isLoading, error: loadError } = useMatchData();
  const [saveError, setSaveError] = useState<string | null>(null);

  const player1 = players.find((player) => player.id === Number(params.player1Id));
  const player2 = players.find((player) => player.id === Number(params.player2Id));
  const bestOf = parseBestOf(params.bestOf);

  async function handleSaveMatch(result: MatchResult) {
    if (!player1 || !player2) return;
    try {
      await addGame({ player1Id: player1.id, player2Id: player2.id, bestOf, ...result });
    } catch {
      setSaveError('Match konnte nicht gespeichert werden.');
      return;
    }
    // Match-Screen schliessen und im Verlauf das neue Match zeigen.
    router.dismissTo('/');
  }

  function renderContent() {
    if (isLoading) return <LoadingIndicator />;

    if (!player1 || !player2) {
      return (
        <Card>
          <ErrorMessage message="Die Spieler für dieses Match wurden nicht gefunden." />
          <PillRow>
            <PillButton label="Zurück" onPress={goBack} />
          </PillRow>
        </Card>
      );
    }

    return (
      <MatchCounter
        player1={player1}
        player2={player2}
        bestOf={bestOf}
        onSaveMatch={handleSaveMatch}
        onCancelMatch={goBack}
      />
    );
  }

  return (
    <Screen>
      <HeaderCard
        title="Live-Match"
        subtitle={bestOf === 1 ? 'Match über 1 Satz' : 'Match über 3 Sätze'}
      />
      <ErrorMessage message={loadError ?? saveError} />
      {renderContent()}
    </Screen>
  );
}
