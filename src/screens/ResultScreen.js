import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors, font, radius } from '../theme';

function messageFor(score, total) {
  if (score === total) return 'Perfect game!';
  if (score >= total * 0.6) return 'Great job!';
  if (score > 0) return 'Nice try!';
  return 'Better luck next time!';
}

// End screen: final score, Play again (same category), or pick another category.
export default function ResultScreen({ category, score, total, results, onPlayAgain, onChangeCategory }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.category, { color: category.color }]}>{category.name}</Text>
        <Text style={styles.label}>Final score</Text>
        <Text style={styles.score}>
          <Text style={{ color: category.color }}>{score}</Text>
          <Text style={styles.total}> / {total}</Text>
        </Text>
        <Text style={styles.message}>{messageFor(score, total)}</Text>
        <View style={styles.dots}>
          {results.map((ok, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: ok ? colors.correct : colors.wrong }]} />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Play again" onPress={onPlayAgain} accent={category.color} />
        <PrimaryButton title="Choose another category" onPress={onChangeCategory} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', gap: 24 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  category: { fontSize: 16, fontFamily: font.extrabold },
  label: { color: colors.textMuted, fontSize: 16, marginTop: 8, fontFamily: font.medium },
  score: { fontSize: 72, fontFamily: font.black },
  total: { color: colors.textMuted, fontSize: 36, fontFamily: font.bold },
  message: { color: colors.text, fontSize: 22, fontFamily: font.bold },
  dots: { flexDirection: 'row', gap: 8, marginTop: 6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  actions: { gap: 12 },
});
