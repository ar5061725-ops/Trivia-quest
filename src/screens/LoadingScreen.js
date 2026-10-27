import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font } from '../theme';

// Shown for a moment while a fresh set of questions is prepared.
export default function LoadingScreen({ category, onCancel }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={category.color} />
      <Text style={styles.title}>Preparing your questions…</Text>
      <Text style={[styles.category, { color: category.color }]}>{category.name}</Text>
      <Pressable onPress={onCancel} accessibilityRole="button" hitSlop={12} style={styles.cancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  title: { color: colors.text, fontSize: 20, fontFamily: font.bold, marginTop: 8 },
  category: { fontSize: 15, fontFamily: font.extrabold },
  cancel: { minHeight: 44, justifyContent: 'center', marginTop: 16 },
  cancelText: { color: colors.textMuted, fontSize: 16, fontFamily: font.semibold },
});
