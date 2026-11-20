import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type AvatarProps = {
  name: string;
  color?: string;
};

export function Avatar({ name, color = Colors.win }: AvatarProps) {
  return (
    <View style={[styles.avatar, { backgroundColor: color }]}>
      <Text style={styles.text}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.textOnBrand,
    fontSize: 12,
    fontWeight: '700',
  },
});
