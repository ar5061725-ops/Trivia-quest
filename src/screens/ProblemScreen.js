import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors, font } from '../theme';

const CONTENT = {
  error: {
    icon: '⚠️',
    title: 'Something went wrong',
    text: "We couldn't load your questions. Check your connection and try again.",
  },
  busy: {
    icon: '⏳',
    title: 'Lots of players right now',
    text: 'Hang tight, we will try again in a moment.',
  },
  empty: {
    icon: '📭',
    title: 'No questions found',
    text: 'There is nothing to play in this category yet. Try another one.',
  },
};

const AUTO_RETRY_SECONDS = 6;

// One screen for the three "not a normal quiz" faces: error, busy (too many requests) and empty.
// A 'busy' screen retries by itself after a short countdown.
export default function ProblemScreen({ kind, category, onRetry, onPlayOffline, onBack }) {
  const content = CONTENT[kind];
  const [seconds, setSeconds] = useState(AUTO_RETRY_SECONDS);

  useEffect(() => {
    if (kind !== 'busy') return undefined;
    if (seconds === 0) {
      onRetry();
      return undefined;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [kind, seconds, onRetry]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{content.icon}</Text>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.text}>{content.text}</Text>
      {kind === 'busy' && <Text style={[styles.count, { color: category.color }]}>Retrying in {seconds}s</Text>}

      <View style={styles.actions}>
        {kind !== 'empty' && (
          <PrimaryButton title="Try again" onPress={onRetry} accent={category.color} />
        )}
        {kind === 'error' && (
          <PrimaryButton title="Play offline questions" onPress={onPlayOffline} variant="outline" />
        )}
        <PrimaryButton
          title="Choose another category"
          onPress={onBack}
          accent={category.color}
          variant={kind === 'empty' ? 'solid' : 'outline'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  icon: { fontSize: 56, marginBottom: 8 },
  title: { color: colors.text, fontSize: 24, fontFamily: font.extrabold, textAlign: 'center' },
  text: {
    color: colors.textMuted,
    fontSize: 16,
    fontFamily: font.medium,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  count: { fontSize: 15, fontFamily: font.bold, marginTop: 4 },
  actions: { alignSelf: 'stretch', gap: 12, marginTop: 24 },
});
