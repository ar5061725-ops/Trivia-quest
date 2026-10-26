import { StyleSheet, Text, View } from 'react-native';
import { colors, font } from '../theme';

// Always-visible top bar: which question you are on, a progress bar, and the score.
export default function ScoreBar({ current, total, score, accent }) {
  const progress = current / total;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.counter}>
          Question {current} of {total}
        </Text>
        <View style={[styles.scorePill, { borderColor: accent }]}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={[styles.scoreValue, { color: accent }]}>{score}</Text>
        </View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counter: { color: colors.textMuted, fontSize: 15, fontFamily: font.semibold },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 2,
    backgroundColor: colors.surface,
  },
  scoreLabel: { color: colors.textMuted, fontSize: 14, fontFamily: font.semibold },
  scoreValue: { fontSize: 20, fontFamily: font.extrabold },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
