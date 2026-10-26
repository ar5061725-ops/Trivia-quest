import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, touch } from '../theme';

// One answer choice. `status` decides how it looks:
//   'idle'    – not answered yet
//   'correct' – this is the right answer (shown after any tap)
//   'wrong'   – the player picked this and it was wrong
//   'dimmed'  – answered already, this choice was not involved
export default function AnswerButton({ label, letter, status = 'idle', onPress, disabled }) {
  const look = looks[status];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: look.bg, borderColor: look.border, opacity: look.opacity },
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={[styles.badge, { backgroundColor: look.badgeBg }]}>
        <Text style={[styles.badgeText, { color: look.badgeText }]}>{look.mark ?? letter}</Text>
      </View>
      <Text style={[styles.label, { color: look.text }]}>{label}</Text>
    </Pressable>
  );
}

const looks = {
  idle: {
    bg: colors.surfaceRaised,
    border: colors.border,
    text: colors.text,
    badgeBg: colors.surface,
    badgeText: colors.textMuted,
    opacity: 1,
  },
  correct: {
    bg: colors.correctBg,
    border: colors.correct,
    text: colors.text,
    badgeBg: colors.correct,
    badgeText: colors.background,
    opacity: 1,
    mark: '✓',
  },
  wrong: {
    bg: colors.wrongBg,
    border: colors.wrong,
    text: colors.text,
    badgeBg: colors.wrong,
    badgeText: colors.background,
    opacity: 1,
    mark: '✕',
  },
  dimmed: {
    bg: colors.surfaceRaised,
    border: colors.border,
    text: colors.textMuted,
    badgeBg: colors.surface,
    badgeText: colors.textMuted,
    opacity: 0.5,
  },
};

const styles = StyleSheet.create({
  button: {
    minHeight: touch.minHeight + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  pressed: { transform: [{ scale: 0.98 }] },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 16, fontFamily: font.extrabold },
  label: { flex: 1, fontSize: 17, fontFamily: font.semibold, lineHeight: 22 },
});
