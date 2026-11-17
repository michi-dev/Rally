import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getGames, getPlayers, type Game, type Player } from '@/lib/database';

/** Lädt Spieler und Matches jedes Mal neu, wenn der Screen in den Fokus kommt. */
export function useMatchData() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [loadedPlayers, loadedGames] = await Promise.all([getPlayers(), getGames()]);
      setPlayers(loadedPlayers);
      setGames(loadedGames);
      setError(null);
    } catch {
      setError('Daten konnten nicht geladen werden.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { players, games, error, reload };
}
