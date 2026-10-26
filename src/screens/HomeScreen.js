import { FlatList, StyleSheet, Text, View } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/categories';
import { colors, font } from '../theme';

// First screen: pick one of the 24 categories.
export default function HomeScreen({ onSelectCategory }) {
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
  subtitle: { color: colors.textMuted, fontSize: 16, fontFamily: font.medium },
});
