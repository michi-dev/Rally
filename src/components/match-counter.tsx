import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { MatchFormat } from '@/components/match-form';
import type { Player } from '@/lib/players-db';

export type MatchResult = {
  sets1: number;      // gewonnene Sätze Player 1
  sets2: number;      // gewonnene Sätze Player 2
  games: string;      // Punktestand
};

type MatchCounterProps = {
  player1: Player;
  player2: Player;
  format: MatchFormat;
  onEndMatch: (result: MatchResult | null) => void; 
};

type PlayerKey = 'p1' | 'p2';

type SetScore = { games1: number; games2: number };

type TennisState = {
  points1: number;
  points2: number;
  games1: number;
  games2: number;
  sets1: number;
  sets2: number;
  tiebreak: boolean;
  tiebreakPoints1: number;
  tiebreakPoints2: number;
  setHistory: SetScore[];
};

const initialTennisState: TennisState = {
  points1: 0,
  points2: 0,
  games1: 0,
  games2: 0,
  sets1: 0,
  sets2: 0,
  tiebreak: false,
  tiebreakPoints1: 0,
  tiebreakPoints2: 0,
  setHistory: [],
};

const POINT_LABELS = ['0', '15', '30', '40'];

/**
 * Classic tennis scoring: games are won at 4+ points with a 2-point lead
 * (deuce/advantage above 40-40); sets are won at 6+ games with a 2-game
 * lead, falling back to a 7-point tiebreak at 6-6.
 */
function scorePoint(state: TennisState, scorer: PlayerKey): TennisState {
  const next = { ...state };

  if (next.tiebreak) {
    if (scorer === 'p1') next.tiebreakPoints1 += 1;
    else next.tiebreakPoints2 += 1;

    const leader = Math.max(next.tiebreakPoints1, next.tiebreakPoints2);
    const diff = Math.abs(next.tiebreakPoints1 - next.tiebreakPoints2);
    if (leader >= 7 && diff >= 2) {
      const winner: PlayerKey = next.tiebreakPoints1 > next.tiebreakPoints2 ? 'p1' : 'p2';
      next.games1 = winner === 'p1' ? 7 : 6;
      next.games2 = winner === 'p2' ? 7 : 6;
      next.setHistory = [...next.setHistory, { games1: next.games1, games2: next.games2 }];
      if (winner === 'p1') next.sets1 += 1;
      else next.sets2 += 1;
      next.games1 = 0;
      next.games2 = 0;
      next.tiebreak = false;
      next.tiebreakPoints1 = 0;
      next.tiebreakPoints2 = 0;
    }
    return next;
  }

  if (scorer === 'p1') next.points1 += 1;
  else next.points2 += 1;

  const leadingPoints = Math.max(next.points1, next.points2);
  const pointDiff = Math.abs(next.points1 - next.points2);
  if (leadingPoints < 4 || pointDiff < 2) return next;

  const gameWinner: PlayerKey = next.points1 > next.points2 ? 'p1' : 'p2';
  next.points1 = 0;
  next.points2 = 0;
  if (gameWinner === 'p1') next.games1 += 1;
  else next.games2 += 1;

  if (next.games1 === 6 && next.games2 === 6) {
    next.tiebreak = true;
    next.tiebreakPoints1 = 0;
    next.tiebreakPoints2 = 0;
    return next;
  }

  const leadingGames = Math.max(next.games1, next.games2);
  const gameDiff = Math.abs(next.games1 - next.games2);
  if (leadingGames >= 6 && gameDiff >= 2) {
    next.setHistory = [...next.setHistory, { games1: next.games1, games2: next.games2 }];
    if (next.games1 > next.games2) next.sets1 += 1;
    else next.sets2 += 1;
    next.games1 = 0;
    next.games2 = 0;
  }

  return next;
}

function getPointsLabel(mine: number, other: number): string {
  if (mine < 3 || other < 3) return POINT_LABELS[mine];
  if (mine > other) return 'Ad';
  return '40';
}

export function MatchCounter({ player1, player2, format, onEndMatch }: MatchCounterProps) {
  const theme = useTheme();
  const [state, setState] = useState<TennisState>(initialTennisState);
  const {
    points1, points2, games1, games2, sets1, sets2,
    tiebreak, tiebreakPoints1, tiebreakPoints2, setHistory,
  } = state;

  const requiredSets = format === '1' ? 1 : 2;
  const winner = sets1 >= requiredSets ? player1 : sets2 >= requiredSets ? player2 : null;

  function handlePoint(scorer: PlayerKey) {
    if (winner) return;
    setState((prev) => scorePoint(prev, scorer));
  }
  function handleEndMatch() {
      if (!winner) {
        onEndMatch(null);
        return;
      }
      onEndMatch({
        sets1,
        sets2,
        games: setHistory.map((s) => `${s.games1}:${s.games2}`).join(','),
      });
    }
  const isDeuce = !tiebreak && points1 >= 3 && points2 >= 3 && points1 === points2;

  return (
    <ThemedView type="backgroundElement" style={[styles.stepContainer, { borderColor: theme.border }]}>
      <ThemedText type="code" style={styles.code}>
        match
      </ThemedText>

      <View style={styles.scoreRow}>
        <ThemedText type="subtitle">{player1.name}</ThemedText>
        <ThemedText type="subtitle">{sets1}</ThemedText>
        <ThemedText type="subtitle">:</ThemedText>
        <ThemedText type="subtitle">{sets2}</ThemedText>
        <ThemedText type="subtitle">{player2.name}</ThemedText>
      </View>

      {setHistory.length > 0 && (
        <View style={styles.pillRow}>
          {setHistory.map((set, index) => (
            <ThemedView key={index} type="backgroundSelected" style={[styles.historyPill, { borderColor: theme.border }]}>
              <ThemedText type="code">{set.games1}:{set.games2}</ThemedText>
            </ThemedView>
          ))}
        </View>
      )}

      {!winner && (
        <>
          <ThemedText type="small">
            Spiele {games1}:{games2}
            {tiebreak ? ` (Tiebreak ${tiebreakPoints1}:${tiebreakPoints2})` : ''}
          </ThemedText>

          <ThemedText type="small">
            {tiebreak
              ? 'Punkte werden im Tiebreak oben gezählt'
              : isDeuce
                ? 'Einstand'
                : `Punkte ${getPointsLabel(points1, points2)}:${getPointsLabel(points2, points1)}`}
          </ThemedText>
        </>
      )}

      {winner ? (
        <ThemedText type="smallBold">{winner.name} gewinnt das Match!</ThemedText>
      ) : (
        <View style={styles.pillRow}>
          <Pressable onPress={() => handlePoint('p1')}>
            <ThemedView type="backgroundSelected" style={[styles.pill, { borderColor: theme.border }]}>
              <ThemedText type="smallBold">Punkt für {player1.name}</ThemedText>
            </ThemedView>
          </Pressable>
          <Pressable onPress={() => handlePoint('p2')}>
            <ThemedView type="backgroundSelected" style={[styles.pill, { borderColor: theme.border }]}>
              <ThemedText type="smallBold">Punkt für {player2.name}</ThemedText>
            </ThemedView>
          </Pressable>
        </View>
      )}

      <Pressable onPress={handleEndMatch} style={styles.endButton}>
        <ThemedView type="backgroundSelected" style={[styles.endButtonInner, { borderColor: theme.border }]}>
          <ThemedText type="smallBold">Match beenden</ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
  },
  historyPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
  },
  endButton: {
    alignSelf: 'flex-start',
  },
  endButtonInner: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
