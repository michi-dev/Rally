import type { Game, Player } from './players-db';

export type PlayerStat = {
  player: Player;
  played: number;   
  wins: number;     
  winRate: number;  
};


export type Stats = {
  matchCount: number;  
  avgSets: number;     
  deciders: number;    
  ranking: PlayerStat[];
};

function parseSets(game: Game) {
  const [sets1, sets2] = game.sets.split('/').map(Number);
  return { sets1, sets2 };
}


function winnerOf(game: Game): number {
  const { sets1, sets2 } = parseSets(game);
  return sets1 > sets2 ? game.p1_fk : game.p2_fk;
}

export function computeStats(players: Player[], games: Game[]): Stats {
  let totalSets = 0;
  let deciders = 0;

  for (const game of games) {
    const { sets1, sets2 } = parseSets(game);
    totalSets += sets1 + sets2;
    if (sets1 > 0 && sets2 > 0) deciders += 1;
  }


  const ranking = players.map((player) => {
  
    const myGames = games.filter(
      (g) => g.p1_fk === player.id || g.p2_fk === player.id,
    );
    const wins = myGames.filter((g) => winnerOf(g) === player.id).length;
    const played = myGames.length;

    return {
      player,
      played,
      wins,
      winRate: played > 0 ? wins / played : 0,
    };
  });

  
  ranking.sort(
    (a, b) =>
      b.winRate - a.winRate ||
      b.wins - a.wins ||
      a.player.name.localeCompare(b.player.name),
  );

  return {
    matchCount: games.length,
    avgSets: games.length > 0 ? totalSets / games.length : 0,
    deciders,
    ranking,
  };
}
