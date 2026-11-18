import { Card } from '@/components/card';
import { ErrorMessage } from '@/components/error-message';
import { HeaderCard } from '@/components/header-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useMatchData } from '@/hooks/use-match-data';
import type { Player } from '@/lib/database';
import { formatSetScores } from '@/lib/tennis-scoring';

function playerName(players: Player[], playerId: number): string {
  return players.find((player) => player.id === playerId)?.name ?? 'Gelöschter Spieler';
}

export default function HistoryScreen() {
  const { players, games, error } = useMatchData();
  const newestGamesFirst = [...games].reverse();

  return (
    <Screen>
      <HeaderCard title="Matchverlauf" subtitle={`${games.length} Matches`} />
      <ErrorMessage message={error} />
      <Card>
        {newestGamesFirst.length === 0 && (
          <ThemedText type="small">Noch keine Matches gespielt.</ThemedText>
        )}
        {newestGamesFirst.map((game) => (
          <ThemedText key={game.id} type="small">
            {playerName(players, game.player1Id)} {game.sets1} : {game.sets2}{' '}
            {playerName(players, game.player2Id)} · {formatSetScores(game.setScores)}
          </ThemedText>
        ))}
      </Card>
    </Screen>
  );
}
