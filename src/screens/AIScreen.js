import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { generateCategory } from '../api/openrouter';
import { colors, font, radius } from '../theme';

const MESSAGES = {
  nokey: 'لم يتم إعداد مفتاح الذكاء الاصطناعي بعد. أضفه في ملف .env ثم أعد تشغيل التطبيق.',
  busy: 'الخدمة مزدحمة الآن. انتظر قليلاً ثم حاول مرة أخرى.',
  invalid: 'لم نتمكن من إعداد أسئلة جيدة لهذا الموضوع. جرّب صياغة مختلفة.',
  error: 'تعذّر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.',
};

// A question mark that keeps turning while the questions are being written.
function SpinningMark() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={[styles.mark, { transform: [{ rotate }] }]}>
      <Text style={styles.markText}>?</Text>
    </Animated.View>
  );
}

// "AI" page: describe a topic and get one custom category with 5 multiple-choice questions.
export default function AIScreen({ onCreated, onBack }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cancelled = useRef(false);

  useEffect(() => () => { cancelled.current = true; }, []);

  const canSubmit = topic.trim().length > 0 && !loading;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    const { status, category } = await generateCategory(topic.trim());
    if (cancelled.current) return;
    setLoading(false);
    if (status === 'ok') onCreated(category);
    else setError(MESSAGES[status] ?? MESSAGES.error);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <SpinningMark />
        <Text style={styles.loadingText}>جارٍ إعداد الأسئلة لك...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} accessibilityRole="button" hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹ Categories</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>AI</Text>
          <Text style={styles.subtitle}>اكتب أي موضوع وسننشئ لك تصنيفاً مخصصاً من 5 أسئلة.</Text>
        </View>

        <TextInput
          value={topic}
          onChangeText={setTopic}
          placeholder="مثال: الفضاء، كرة القدم، التاريخ الإسلامي"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
          maxLength={200}
          textAlign="auto"
          accessibilityLabel="الموضوع"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={{ opacity: canSubmit ? 1 : 0.5 }} pointerEvents={canSubmit ? 'auto' : 'none'}>
          <PrimaryButton title="إنشاء باستخدام الذكاء الاصطناعي" onPress={submit} accent={colors.accent} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, paddingBottom: 40, gap: 18 },
  back: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  backText: { color: colors.textMuted, fontSize: 16, fontFamily: font.semibold },
  header: { gap: 6 },
  title: { color: colors.text, fontSize: 40, fontFamily: font.black, letterSpacing: -1 },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 24, fontFamily: font.arabic },
  input: {
    minHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    color: colors.text,
    fontSize: 18,
    fontFamily: font.arabic,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.text,
    backgroundColor: colors.wrongBg,
    borderColor: colors.wrong,
    borderWidth: 2,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: font.arabic,
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24 },
  mark: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  markText: { color: colors.accent, fontSize: 48, fontFamily: font.black },
  loadingText: { color: colors.text, fontSize: 20, fontFamily: font.arabic, textAlign: 'center' },
});
