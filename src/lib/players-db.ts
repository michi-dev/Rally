import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AsyncStorage is a simple key-value store, not a relational database.
 * "Database" here means the storage key namespace; "table" means the
 * JSON array kept under each *_TABLE_KEY.
 * https://react-native-async-storage.github.io/async-storage/docs/usage
 */
const DATABASE_NAME = "@rally-db";
const PLAYER_TABLE_KEY = `${DATABASE_NAME}/player`;
const GAME_TABLE_KEY = `${DATABASE_NAME}/game`;

export type Player = {
  id: number;
  games: number;
  wins: number;
};

export type Game = {
  id: number;
  timestamp: string; /** ID of player 1 (foreign key -> Player.id) */
  p1_fk: number; /** ID of player 2 (foreign key -> Player.id) */
  p2_fk: number; /** Set score, e.g. "2/3" — first number is p1's result, second is p2's */
  sets: string; /** Game score, e.g. "3/1" — first number is p1's result, second is p2's */
  games: string;
};

export async function initDatabase(): Promise<void> {
  const existingPlayers = await AsyncStorage.getItem(PLAYER_TABLE_KEY);

  if (existingPlayers === null) {
    await AsyncStorage.setItem(PLAYER_TABLE_KEY, JSON.stringify([]));
  }

  const existingGames = await AsyncStorage.getItem(GAME_TABLE_KEY);
  if (existingGames === null) {
    await AsyncStorage.setItem(GAME_TABLE_KEY, JSON.stringify([]));
  }
}

async function nextId(records: { id: number }[]): Promise<number> {
  return records.reduce((maxId, record) => Math.max(maxId, record.id), 0) + 1;
}

// --- player table ---
export async function getPlayers(): Promise<Player[]> {
  const raw = await AsyncStorage.getItem(PLAYER_TABLE_KEY);
  return raw ? (JSON.parse(raw) as Player[]) : [];
}

export async function addPlayer(): Promise<Player> {
  const players = await getPlayers();
  const player: Player = { id: await nextId(players), games: 0, wins: 0 };
  await AsyncStorage.setItem(
    PLAYER_TABLE_KEY,
    JSON.stringify([...players, player]),
  );
  return player;
}

export async function deletePlayer(id: number): Promise<void> {
  const players = await getPlayers();
  await AsyncStorage.setItem(
    PLAYER_TABLE_KEY,
    JSON.stringify(players.filter((p) => p.id !== id)),
  );
}

// --- game table ---
export async function getGames(): Promise<Game[]> {
  const raw = await AsyncStorage.getItem(GAME_TABLE_KEY);
  return raw ? (JSON.parse(raw) as Game[]) : [];
}

export async function addGame(
  p1_fk: number,
  p2_fk: number,
  sets: string,
  games: string,
): Promise<Game> {
  const existingGames = await getGames();
  const game: Game = {
    id: await nextId(existingGames),
    timestamp: new Date().toISOString(),
    p1_fk,
    p2_fk,
    sets,
    games,
  };
  await AsyncStorage.setItem(
    GAME_TABLE_KEY,
    JSON.stringify([...existingGames, game]),
  );
  return game;
}

export async function deleteGame(id: number): Promise<void> {
  const games = await getGames();
  await AsyncStorage.setItem(
    GAME_TABLE_KEY,
    JSON.stringify(games.filter((g) => g.id !== id)),
  );
}
