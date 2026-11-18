import AsyncStorage from '@react-native-async-storage/async-storage';

import type { BestOf, SetScore } from './tennis-scoring';

/**
 * AsyncStorage ist ein einfacher Key-Value-Speicher, keine relationale Datenbank.
 * Jede "Tabelle" ist ein JSON-Array, das unter einem eigenen Schlüssel gespeichert wird.
 * https://react-native-async-storage.github.io/async-storage/docs/usage
 */
const DATABASE_NAME = '@rally-db';
const PLAYER_TABLE_KEY = `${DATABASE_NAME}/player`;
const GAME_TABLE_KEY = `${DATABASE_NAME}/game`;

export type Player = {
  id: number;
  name: string;
};

export type Game = {
  id: number;
  /** Zeitpunkt des Matchendes als ISO-String */
  timestamp: string;
  player1Id: number;
  player2Id: number;
  /** Gewähltes Format: Match über 1 oder 3 Sätze */
  bestOf: BestOf;
  /** Gewonnene Sätze von Spieler 1 */
  sets1: number;
  /** Gewonnene Sätze von Spieler 2 */
  sets2: number;
  /**
   * Games pro gespieltem Satz, z.B. [{ games1: 6, games2: 4 }, { games1: 7, games2: 5 }].
   * Bei manuell beendeten Matches ist der angefangene Satz enthalten.
   */
  setScores: SetScore[];
};

/** Matches, die vor dem Feld `bestOf` gespeichert wurden. */
type GameWithoutBestOf = Omit<Game, 'bestOf'> & { bestOf?: BestOf };

export type NewGame = Omit<Game, 'id' | 'timestamp'>;

/** Format der Matches vor dem Umbau: Sätze und Games wurden als Text gespeichert. */
type LegacyGame = {
  id: number;
  timestamp: string;
  p1_fk: number;
  p2_fk: number;
  /** z.B. "2/1" */
  sets: string;
  /** z.B. "6:4,7:5" */
  games: string;
};

/** Ältere Matches haben kein gespeichertes Format: Wer 2 Sätze gewonnen hat, spielte auf 3 Sätze. */
function inferBestOf(sets1: number, sets2: number): BestOf {
  return Math.max(sets1, sets2) >= 2 ? 3 : 1;
}

function migrateLegacyGame(game: GameWithoutBestOf | LegacyGame): Game {
  if (!('p1_fk' in game)) {
    return { ...game, bestOf: game.bestOf ?? inferBestOf(game.sets1, game.sets2) };
  }

  const [sets1, sets2] = game.sets.split('/').map(Number);
  const setScores = game.games
    .split(',')
    .filter(Boolean)
    .map((set) => {
      const [games1, games2] = set.split(':').map(Number);
      return { games1, games2 };
    });

  return {
    id: game.id,
    timestamp: game.timestamp,
    player1Id: game.p1_fk,
    player2Id: game.p2_fk,
    bestOf: inferBestOf(sets1, sets2),
    sets1,
    sets2,
    setScores,
  };
}

async function readTable<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
}

async function writeTable<T>(key: string, records: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(records));
}

function nextId(usedIds: number[]): number {
  return Math.max(0, ...usedIds) + 1;
}

export async function getPlayers(): Promise<Player[]> {
  return readTable<Player>(PLAYER_TABLE_KEY);
}

export async function addPlayer(name: string): Promise<Player> {
  const [players, games] = await Promise.all([getPlayers(), getGames()]);
  // Auch IDs gelöschter Spieler, die noch in Matches vorkommen, gelten als vergeben.
  // Sonst würde ein neuer Spieler die alten Matches eines gelöschten Spielers übernehmen.
  const usedIds = [
    ...players.map((player) => player.id),
    ...games.flatMap((game) => [game.player1Id, game.player2Id]),
  ];
  const player: Player = { id: nextId(usedIds), name };
  await writeTable(PLAYER_TABLE_KEY, [...players, player]);
  return player;
}

/**
 * Löscht nur den Spieler. Seine Matches bleiben im Verlauf und in der Gesamtstatistik erhalten.
 */
export async function deletePlayer(playerId: number): Promise<void> {
  const players = await getPlayers();
  await writeTable(
    PLAYER_TABLE_KEY,
    players.filter((player) => player.id !== playerId),
  );
}

export async function getGames(): Promise<Game[]> {
  const games = await readTable<GameWithoutBestOf | LegacyGame>(GAME_TABLE_KEY);
  return games.map(migrateLegacyGame);
}

export async function addGame(newGame: NewGame): Promise<Game> {
  const games = await getGames();
  const game: Game = {
    id: nextId(games.map((g) => g.id)),
    timestamp: new Date().toISOString(),
    ...newGame,
  };
  await writeTable(GAME_TABLE_KEY, [...games, game]);
  return game;
}
