import type { Game, Player } from './database';

export type PlayerStat = {
  player: Player;
  played: number;
  wins: number;
  winRate: number;
};

export type SetDistributionRow = {
  /** Anzahl gespielter Sätze */
  setCount: number;
  /** Anzahl Matches mit dieser Satzanzahl */
  matchCount: number;
};

export type Stats = {
  /** Gesamtzahl der Matches aller Spieler */
  matchCount: number;
  /** Durchschnittliche Anzahl gespielter Sätze pro Match */
  avgSets: number;
  /** Matches, die in den entscheidenden Satz gingen (z.B. 3. Satz bei "Best of 3") */
  deciders: number;
  ranking: PlayerStat[];
  setDistribution: SetDistributionRow[];
};

const MAX_SETS = 3;

/** Sieger ist, wer mehr Sätze gewonnen hat. Bei Gleichstand (z.B. manuell beendet bei 1:1) gibt es keinen. */
function winnerIdOf(game: Game): number | null {
  if (game.sets1 > game.sets2) return game.player1Id;
  if (game.sets2 > game.sets1) return game.player2Id;
  return null;
}

function playedSetCount(game: Game): number {
  return game.setScores.length;
}

function isDecider(game: Game): boolean {
  return game.bestOf > 1 && playedSetCount(game) === game.bestOf;
}

function computePlayerStat(player: Player, games: Game[]): PlayerStat {
  const playerGames = games.filter(
    (game) => game.player1Id === player.id || game.player2Id === player.id,
  );
  const wins = playerGames.filter((game) => winnerIdOf(game) === player.id).length;
  const played = playerGames.length;

  return { player, played, wins, winRate: played > 0 ? wins / played : 0 };
}

function compareRanking(a: PlayerStat, b: PlayerStat): number {
  return b.winRate - a.winRate || b.wins - a.wins || a.player.name.localeCompare(b.player.name);
}

function computeSetDistribution(games: Game[]): SetDistributionRow[] {
  return Array.from({ length: MAX_SETS }, (_, index) => {
    const setCount = index + 1;
    return {
      setCount,
      matchCount: games.filter((game) => playedSetCount(game) === setCount).length,
    };
  });
}

export function computeStats(players: Player[], games: Game[]): Stats {
  const totalSets = games.reduce((sum, game) => sum + playedSetCount(game), 0);

  return {
    matchCount: games.length,
    avgSets: games.length > 0 ? totalSets / games.length : 0,
    deciders: games.filter(isDecider).length,
    ranking: players.map((player) => computePlayerStat(player, games)).sort(compareRanking),
    setDistribution: computeSetDistribution(games),
  };
}
