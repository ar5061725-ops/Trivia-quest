import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/categories';
import { colors, font, radius } from '../theme';

// First screen: pick one of the 24 categories.
export default function HomeScreen({ onSelectCategory, onOpenAI }) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Trivia Quest</Text>
          <Text style={styles.subtitle}>Pick a category · 5 questions</Text>
          <Pressable
            onPress={onOpenAI}
            accessibilityRole="button"
            accessibilityLabel="AI custom category"
            style={({ pressed }) => [styles.ai, pressed && styles.aiPressed]}
          >
            <Text style={styles.aiIcon}>✨</Text>
            <View style={styles.aiText}>
              <Text style={styles.aiTitle}>تصنيف مخصص</Text>
              <Text style={styles.aiSub}>أنشئ أسئلتك بالذكاء الاصطناعي</Text>
            </View>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        <CategoryCard category={item} onPress={() => onSelectCategory(item)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 40, gap: 12 },
  row: { gap: 12 },
  header: { paddingTop: 12, paddingBottom: 12, gap: 6 },
  title: { color: colors.text, fontSize: 40, fontFamily: font.black, letterSpacing: -1 },
  ai: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  aiPressed: { backgroundColor: colors.surfaceRaised, transform: [{ scale: 0.98 }] },
  aiIcon: { fontSize: 28 },
  aiText: { flex: 1, gap: 2 },
  aiTitle: { color: colors.text, fontSize: 18, fontFamily: font.arabic },
  aiSub: { color: colors.textMuted, fontSize: 14, fontFamily: font.arabic },
  subtitle: { color: colors.textMuted, fontSize: 16, fontFamily: font.medium },
});
