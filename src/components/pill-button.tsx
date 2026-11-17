import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

type PillButtonProps = {
  label: string;
  onPress: () => void;
  /** Gedämpft = nicht ausgewählte Option, wird auf dem Kartenhintergrund dargestellt. */
  muted?: boolean;
  disabled?: boolean;
};

export function PillButton({ label, onPress, muted = false, disabled = false }: PillButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button">
      <ThemedView
        type={muted ? 'backgroundElement' : 'backgroundSelected'}
        style={[styles.pill, disabled && styles.disabled]}
      >
        <ThemedText type="smallBold">{label}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

/** Ordnet mehrere PillButtons umbrechend nebeneinander an. */
export function PillRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
