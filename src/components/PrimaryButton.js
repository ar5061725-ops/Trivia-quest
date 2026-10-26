import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, font, radius, touch } from '../theme';

// The big full-width button used for "Next", "Play again" and similar actions.
// variant 'solid' = filled with the accent colour, 'outline' = quieter second option.
export default function PrimaryButton({ title, onPress, accent = colors.text, variant = 'solid' }) {
  const solid = variant === 'solid';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        solid
          ? { backgroundColor: accent, borderColor: accent }
          : { backgroundColor: 'transparent', borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, { color: solid ? colors.background : colors.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touch.minHeight,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  text: { fontSize: 18, fontFamily: font.extrabold },
});
