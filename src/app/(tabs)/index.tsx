import { useEffect, useState } from 'react';

import HeaderCard from '@/components/header-card';
import { MatchCounter } from '@/components/match-counter';
import { MatchForm, type MatchFormat } from '@/components/match-form';
import { Screen } from '@/components/screen';
import { addGame, getPlayers, initDatabase, type Player } from '@/lib/players-db';

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
    <Screen>
      <HeaderCard logo="Rally" title="Matchverlauf" subtitle="Track your matches" />
      {activeMatch ? (
        <MatchCounter
          player1={activeMatch.player1}
          player2={activeMatch.player2}
          format={activeMatch.format}
          onEndMatch={async (result) => {
            if (result) {
              await addGame(
                activeMatch.player1.id,
                activeMatch.player2.id,
                `${result.sets1}/${result.sets2}`,
              result.games,
              );
            }
            setActiveMatch(null);
          }}

        />
      ) : (
        <MatchForm
          players={players}
          onStartMatch={(player1, player2, format) => setActiveMatch({ player1, player2, format })}
        />
      )}
    </Screen>
  );
}
