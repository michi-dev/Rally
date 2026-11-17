import type { Game, Player } from './database';

export type PlayerStat = {
  player: Player;
  played: number;
  wins: number;
  winRate: number;
};

export type Stats = {
  matchCount: number;
  avgSets: number;
  /** Matches, in denen beide Spieler mindestens einen Satz gewonnen haben */
  deciders: number;
  ranking: PlayerStat[];
};

function winnerIdOf(game: Game): number {
  return game.sets1 > game.sets2 ? game.player1Id : game.player2Id;
}

function isDecider(game: Game): boolean {
  return game.sets1 > 0 && game.sets2 > 0;
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

export function computeStats(players: Player[], games: Game[]): Stats {
  const totalSets = games.reduce((sum, game) => sum + game.sets1 + game.sets2, 0);

  return {
    matchCount: games.length,
    avgSets: games.length > 0 ? totalSets / games.length : 0,
    deciders: games.filter(isDecider).length,
    ranking: players.map((player) => computePlayerStat(player, games)).sort(compareRanking),
  };
}
