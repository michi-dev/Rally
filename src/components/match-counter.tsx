import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { PillButton, PillRow } from '@/components/pill-button';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { Player } from '@/lib/database';
import {
  getMatchWinner,
  getPlayedSetScores,
  getPointsLabel,
  hasMatchStarted,
  INITIAL_MATCH_STATE,
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

export function MatchCounter({
  player1,
  player2,
  bestOf,
  onSaveMatch,
  onCancelMatch,
}: MatchCounterProps) {
  // Alle bisherigen Spielstände, damit sich der letzte Punkt rückgängig machen lässt.
  const [history, setHistory] = useState<MatchState[]>([INITIAL_MATCH_STATE]);
  const state = history[history.length - 1];
  const canUndo = history.length > 1;
  const winnerSide = getMatchWinner(state, bestOf);
  const playersBySide: Record<PlayerSide, Player> = { player1, player2 };
  const winner = winnerSide ? playersBySide[winnerSide] : null;

  function handlePoint(scorer: PlayerSide) {
    if (winner) return;
    setHistory((previous) => [...previous, scorePoint(previous[previous.length - 1], scorer)]);
  }

  function handleUndo() {
    setHistory((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
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
        <Avatar name={player1.name} color={Colors.accent} />
        <ThemedText type="smallBold">{player1.name}</ThemedText>
        <Text style={styles.bigScore}>
          {state.sets1} : {state.sets2}
        </Text>
        <ThemedText type="smallBold">{player2.name}</ThemedText>
        <Avatar name={player2.name} />
      </View>

      {state.setHistory.length > 0 && (
        <View style={styles.chips}>
          {state.setHistory.map((set, setNumber) => (
            <Text key={setNumber} style={styles.chip}>
              {set.games1}:{set.games2}
            </Text>
          ))}
        </View>
      )}

      {winner ? (
        <ThemedText type="smallBold">{winner.name} gewinnt das Match!</ThemedText>
      ) : (
        <>
          <ThemedText type="label" style={styles.center}>
            {state.isTiebreak ? 'Tiebreak' : 'Aktuelles Spiel'} · {state.games1}:{state.games2}{' '}
            Games
          </ThemedText>
          <View style={styles.tileRow}>
            <View style={styles.pointTile}>
              <Text style={styles.pointValue}>
                {state.isTiebreak
                  ? state.tiebreakPoints1
                  : getPointsLabel(state.points1, state.points2)}
              </Text>
              <ThemedText type="small">{player1.name}</ThemedText>
            </View>
            <View style={styles.pointTile}>
              <Text style={styles.pointValue}>
                {state.isTiebreak
                  ? state.tiebreakPoints2
                  : getPointsLabel(state.points2, state.points1)}
              </Text>
              <ThemedText type="small">{player2.name}</ThemedText>
            </View>
          </View>

          <View style={styles.tileRow}>
            <View style={styles.half}>
              <PillButton
                label={`Punkt für ${player1.name}`}
                onPress={() => handlePoint('player1')}
              />
            </View>
            <View style={styles.half}>
              <PillButton
                label={`Punkt für ${player2.name}`}
                onPress={() => handlePoint('player2')}
              />
            </View>
          </View>
        </>
      )}

      <PillRow>
        <PillButton
          label="Speichern"
          strong
          onPress={handleSaveMatch}
          disabled={!hasMatchStarted(state)}
        />
        <PillButton label="↶ Letzter Punkt" muted onPress={handleUndo} disabled={!canUndo} />
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
    gap: Spacing.two,
  },
  bigScore: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.accent,
    marginHorizontal: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  chip: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    backgroundColor: Colors.track,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 8,
    overflow: 'hidden',
  },
  center: {
    textAlign: 'center',
  },
  tileRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  pointTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.four,
    backgroundColor: Colors.track,
    borderRadius: 20,
  },
  pointValue: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.accent,
  },
  half: {
    flex: 1,
  },
});
