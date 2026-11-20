import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getGames, getPlayers, type Game, type Player } from '@/lib/database';

/**
 * Lädt Spieler und Matches jedes Mal neu, wenn der Screen in den Fokus kommt.
 * `isLoading` ist nur beim ersten Laden aktiv, damit die Anzeige beim
 * Zurückwechseln auf einen Tab nicht flackert.
 */
export function useMatchData() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [loadedPlayers, loadedGames] = await Promise.all([getPlayers(), getGames()]);
      setPlayers(loadedPlayers);
      setGames(loadedGames);
      setError(null);
    } catch {
      setError('Daten konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { players, games, isLoading, error, reload };
}
