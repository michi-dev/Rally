import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { PillButton, PillRow } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import type { Player } from '@/lib/database';
import {
  getMatchWinner,
  getPlayedSetScores,
  getPointsLabel,
  hasMatchStarted,
  INITIAL_MATCH_STATE,
  isDeuce,
  scorePoint,
  type BestOf,
  type MatchState,
  type PlayerSide,
  type SetScore,
} from '@/lib/tennis-scoring';

export type MatchResult = {
  sets1: number;
  sets2: number;
  setScores: SetScore[];
};

type MatchCounterProps = {
  player1: Player;
  player2: Player;
  bestOf: BestOf;
  /** Speichert das Match – auch wenn es manuell vor dem regulären Ende beendet wird. */
  onSaveMatch: (result: MatchResult) => void;
  /** Verwirft das Match, ohne etwas zu speichern. */
  onCancelMatch: () => void;
};

function describeCurrentGame(state: MatchState): string {
  if (state.isTiebreak) return 'Punkte werden im Tiebreak oben gezählt';
  if (isDeuce(state)) return 'Einstand';
  return `Punkte ${getPointsLabel(state.points1, state.points2)}:${getPointsLabel(state.points2, state.points1)}`;
}

export function MatchCounter({
  player1,
  player2,
  bestOf,
  onSaveMatch,
  onCancelMatch,
}: MatchCounterProps) {
  const [state, setState] = useState<MatchState>(INITIAL_MATCH_STATE);
  const winnerSide = getMatchWinner(state, bestOf);
  const playersBySide: Record<PlayerSide, Player> = { player1, player2 };
  const winner = winnerSide ? playersBySide[winnerSide] : null;

  function handlePoint(scorer: PlayerSide) {
    if (winner) return;
    setState((previous) => scorePoint(previous, scorer));
  }

  function handleSaveMatch() {
    onSaveMatch({
      sets1: state.sets1,
      sets2: state.sets2,
      setScores: getPlayedSetScores(state),
    });
  }

  return (
    <Card>
      <View style={styles.scoreRow}>
        <ThemedText type="subtitle">{player1.name}</ThemedText>
        <ThemedText type="subtitle">
          {state.sets1} : {state.sets2}
        </ThemedText>
        <ThemedText type="subtitle">{player2.name}</ThemedText>
      </View>

      {state.setHistory.length > 0 && (
        <PillRow>
          {state.setHistory.map((set, setNumber) => (
            <ThemedView key={setNumber} type="backgroundSelected" style={styles.setScore}>
              <ThemedText type="code">
                {set.games1}:{set.games2}
              </ThemedText>
            </ThemedView>
          ))}
        </PillRow>
      )}

      {winner ? (
        <ThemedText type="smallBold">{winner.name} gewinnt das Match!</ThemedText>
      ) : (
        <>
          <ThemedText type="small">
            Spiele {state.games1}:{state.games2}
            {state.isTiebreak && ` (Tiebreak ${state.tiebreakPoints1}:${state.tiebreakPoints2})`}
          </ThemedText>
          <ThemedText type="small">{describeCurrentGame(state)}</ThemedText>
          <PillRow>
            <PillButton
              label={`Punkt für ${player1.name}`}
              onPress={() => handlePoint('player1')}
            />
            <PillButton
              label={`Punkt für ${player2.name}`}
              onPress={() => handlePoint('player2')}
            />
          </PillRow>
        </>
      )}

      <PillRow>
        <PillButton
          label="Speichern"
          onPress={handleSaveMatch}
          disabled={!hasMatchStarted(state)}
        />
        {!winner && <PillButton label="Abbrechen" muted onPress={onCancelMatch} />}
      </PillRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  setScore: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
});
