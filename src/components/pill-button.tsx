import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

type PillButtonProps = {
  label: string;
  onPress: () => void;
  /** Gedämpft = nicht ausgewählte Option, wird auf dem Kartenhintergrund dargestellt. */
  muted?: boolean;
  disabled?: boolean;
  /** Hauptaktion (z. B. Speichern) in Dunkelblau. */
  strong?: boolean;
};

export function PillButton({
  label,
  onPress,
  muted = false,
  disabled = false,
  strong = false,
}: PillButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button">
      <View
        style={[
          styles.pill,
          muted ? styles.secondary : styles.primary,
          strong && styles.strong,
          disabled && styles.disabled,
        ]}
      >
        <ThemedText type="smallBold" style={muted ? styles.secondaryLabel : styles.primaryLabel}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

/** Ordnet mehrere PillButtons umbrechend nebeneinander an. */
export function PillRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  primary: {
    backgroundColor: Colors.accent,
  },
  strong: {
    backgroundColor: Colors.brand,
  },
  secondary: {
    backgroundColor: Colors.backgroundElement,
  },
  primaryLabel: {
    color: Colors.textOnBrand,
  },
  secondaryLabel: {
    color: Colors.brand,
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
