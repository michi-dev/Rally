import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

type ErrorMessageProps = {
  message: string | null;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <ThemedText type="smallBold" style={styles.error} accessibilityRole="alert">
      {message}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  error: {
    color: Colors.error,
  },
});
