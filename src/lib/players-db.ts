import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage is a simple key-value store, not a relational database.
 * "Database" here means the storage key namespace; "table" means the
 * JSON array of players kept under PLAYERS_TABLE_KEY.
 * https://react-native-async-storage.github.io/async-storage/docs/usage
 */
const DATABASE_NAME = '@rally-db';
const PLAYERS_TABLE_KEY = `${DATABASE_NAME}/players`;

export type Player = {
  id: string;
  firstName: string;
  lastName: string;
};

export async function initDatabase(): Promise<void> {
  const existing = await AsyncStorage.getItem(PLAYERS_TABLE_KEY);
  if (existing === null) {
    await AsyncStorage.setItem(PLAYERS_TABLE_KEY, JSON.stringify([]));
  }
}

export async function getPlayers(): Promise<Player[]> {
  const raw = await AsyncStorage.getItem(PLAYERS_TABLE_KEY);
  return raw ? (JSON.parse(raw) as Player[]) : [];
}

export async function addPlayer(firstName: string, lastName: string): Promise<Player> {
  const players = await getPlayers();
  const player: Player = { id: Date.now().toString(), firstName, lastName };
  await AsyncStorage.setItem(PLAYERS_TABLE_KEY, JSON.stringify([...players, player]));
  return player;
}

export async function deletePlayer(id: string): Promise<void> {
  const players = await getPlayers();
  await AsyncStorage.setItem(PLAYERS_TABLE_KEY, JSON.stringify(players.filter((p) => p.id !== id)));
}
