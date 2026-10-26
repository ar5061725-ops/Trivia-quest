import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScoreBar from '../components/ScoreBar';
import QuestionCard from '../components/QuestionCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors, font, radius } from '../theme';

// The game screen: score bar, the current question, feedback, and a Next button.
export default function QuizScreen({ category, questions, index, score, picked, onPick, onNext, onQuit }) {
  const question = questions[index];
  const answered = picked !== null;
  const isCorrect = answered && picked === question.correct_answer;
  const isLast = index === questions.length - 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={onQuit} accessibilityRole="button" hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹ Categories</Text>
        </Pressable>
        <Text style={[styles.category, { color: category.color }]} numberOfLines={1}>
          {category.name}
        </Text>
      </View>

      <ScoreBar current={index + 1} total={questions.length} score={score} accent={category.color} />

      <QuestionCard question={question} picked={picked} onPick={onPick} accent={category.color} />

      {answered && (
        <View style={[styles.feedback, isCorrect ? styles.feedbackRight : styles.feedbackWrong]}>
          <Text style={styles.feedbackTitle}>{isCorrect ? 'Correct! +1' : 'Wrong'}</Text>
          {!isCorrect && (
            <Text style={styles.feedbackText}>The answer is {question.correct_answer}</Text>
          )}
        </View>
      )}

      {answered && (
        <PrimaryButton title={isLast ? 'See my score' : 'Next question'} onPress={onNext} accent={category.color} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  back: { minHeight: 44, justifyContent: 'center' },
  backText: { color: colors.textMuted, fontSize: 16, fontFamily: font.semibold },
  category: { flexShrink: 1, fontSize: 15, fontFamily: font.extrabold, textAlign: 'right' },
  feedback: { borderRadius: radius.md, padding: 16, gap: 4, borderWidth: 2 },
  feedbackRight: { backgroundColor: colors.correctBg, borderColor: colors.correct },
  feedbackWrong: { backgroundColor: colors.wrongBg, borderColor: colors.wrong },
  feedbackTitle: { color: colors.text, fontSize: 20, fontFamily: font.extrabold },
  feedbackText: { color: colors.text, fontSize: 16, fontFamily: font.medium },
});
