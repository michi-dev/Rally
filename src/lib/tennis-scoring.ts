/**
 * Klassische Tennis-Zählweise:
 * - Ein Game gewinnt, wer mindestens 4 Punkte und 2 Punkte Vorsprung hat (Einstand/Vorteil ab 40:40).
 * - Einen Satz gewinnt, wer mindestens 6 Games und 2 Games Vorsprung hat.
 * - Bei 6:6 entscheidet ein Tiebreak bis 7 Punkte mit 2 Punkten Vorsprung.
 */

export type PlayerSide = 'player1' | 'player2';

/** Anzahl Sätze eines Matches ("Best of"). */
export type BestOf = 1 | 3;

export type SetScore = { games1: number; games2: number };

export type MatchState = {
  points1: number;
  points2: number;
  games1: number;
  games2: number;
  sets1: number;
  sets2: number;
  isTiebreak: boolean;
  tiebreakPoints1: number;
  tiebreakPoints2: number;
  setHistory: SetScore[];
};

export const INITIAL_MATCH_STATE: MatchState = {
  points1: 0,
  points2: 0,
  games1: 0,
  games2: 0,
  sets1: 0,
  sets2: 0,
  isTiebreak: false,
  tiebreakPoints1: 0,
  tiebreakPoints2: 0,
  setHistory: [],
};

const POINTS_TO_WIN_GAME = 4;
const GAMES_TO_WIN_SET = 6;
const POINTS_TO_WIN_TIEBREAK = 7;
const MIN_LEAD_TO_WIN = 2;
const POINT_LABELS = ['0', '15', '30', '40'];
const POINTS_FOR_DEUCE = 3;

function hasWon(score: number, opponentScore: number, target: number): boolean {
  return score >= target && score - opponentScore >= MIN_LEAD_TO_WIN;
}

function addPoint(value: number, side: PlayerSide, scorer: PlayerSide): number {
  return side === scorer ? value + 1 : value;
}

function finishSet(state: MatchState, winner: PlayerSide, finalScore: SetScore): MatchState {
  return {
    ...state,
    points1: 0,
    points2: 0,
    games1: 0,
    games2: 0,
    sets1: addPoint(state.sets1, 'player1', winner),
    sets2: addPoint(state.sets2, 'player2', winner),
    isTiebreak: false,
    tiebreakPoints1: 0,
    tiebreakPoints2: 0,
    setHistory: [...state.setHistory, finalScore],
  };
}

function scoreTiebreakPoint(state: MatchState, scorer: PlayerSide): MatchState {
  const tiebreakPoints1 = addPoint(state.tiebreakPoints1, 'player1', scorer);
  const tiebreakPoints2 = addPoint(state.tiebreakPoints2, 'player2', scorer);

  if (hasWon(tiebreakPoints1, tiebreakPoints2, POINTS_TO_WIN_TIEBREAK)) {
    return finishSet(state, 'player1', { games1: GAMES_TO_WIN_SET + 1, games2: GAMES_TO_WIN_SET });
  }
  if (hasWon(tiebreakPoints2, tiebreakPoints1, POINTS_TO_WIN_TIEBREAK)) {
    return finishSet(state, 'player2', { games1: GAMES_TO_WIN_SET, games2: GAMES_TO_WIN_SET + 1 });
  }
  return { ...state, tiebreakPoints1, tiebreakPoints2 };
}

function winGame(state: MatchState, winner: PlayerSide): MatchState {
  const games1 = addPoint(state.games1, 'player1', winner);
  const games2 = addPoint(state.games2, 'player2', winner);
  const next = { ...state, points1: 0, points2: 0, games1, games2 };

  if (games1 === GAMES_TO_WIN_SET && games2 === GAMES_TO_WIN_SET) {
    return { ...next, isTiebreak: true };
  }
  if (hasWon(games1, games2, GAMES_TO_WIN_SET))
    return finishSet(next, 'player1', { games1, games2 });
  if (hasWon(games2, games1, GAMES_TO_WIN_SET))
    return finishSet(next, 'player2', { games1, games2 });
  return next;
}

/** Gibt den neuen Spielstand zurück, nachdem `scorer` einen Punkt gewonnen hat. */
export function scorePoint(state: MatchState, scorer: PlayerSide): MatchState {
  if (state.isTiebreak) return scoreTiebreakPoint(state, scorer);

  const points1 = addPoint(state.points1, 'player1', scorer);
  const points2 = addPoint(state.points2, 'player2', scorer);

  if (hasWon(points1, points2, POINTS_TO_WIN_GAME)) return winGame(state, 'player1');
  if (hasWon(points2, points1, POINTS_TO_WIN_GAME)) return winGame(state, 'player2');
  return { ...state, points1, points2 };
}

export function getMatchWinner(state: MatchState, bestOf: BestOf): PlayerSide | null {
  const setsToWin = Math.ceil(bestOf / 2);
  if (state.sets1 >= setsToWin) return 'player1';
  if (state.sets2 >= setsToWin) return 'player2';
  return null;
}

export function isDeuce(state: MatchState): boolean {
  return !state.isTiebreak && state.points1 >= POINTS_FOR_DEUCE && state.points1 === state.points2;
}

/** Anzeige eines Punktestands in Tennis-Notation: 0, 15, 30, 40 oder "Ad" (Vorteil). */
export function getPointsLabel(points: number, opponentPoints: number): string {
  if (points < POINTS_FOR_DEUCE || opponentPoints < POINTS_FOR_DEUCE) return POINT_LABELS[points];
  return points > opponentPoints ? 'Ad' : '40';
}

export function formatSetScores(setScores: SetScore[]): string {
  return setScores.map((set) => `${set.games1}:${set.games2}`).join(', ');
}
