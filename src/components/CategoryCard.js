import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius } from '../theme';

// A tappable tile on the home screen for one category.
export default function CategoryCard({ category, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Play ${category.name}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
      <Text style={styles.nameAr} numberOfLines={1}>
        {category.nameAr}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 112,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
    justifyContent: 'flex-end',
  },
  pressed: { backgroundColor: colors.surfaceRaised, transform: [{ scale: 0.97 }] },
  dot: { position: 'absolute', top: 14, left: 14, width: 14, height: 14, borderRadius: 7 },
  name: { color: colors.text, fontSize: 16, fontFamily: font.bold, lineHeight: 20 },
  nameAr: { color: colors.textMuted, fontSize: 13, fontFamily: font.arabic, writingDirection: 'rtl', textAlign: 'left' },
});
