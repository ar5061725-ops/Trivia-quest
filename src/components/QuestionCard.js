import { StyleSheet, Text, View } from 'react-native';
import AnswerButton from './AnswerButton';
import { colors, font, radius } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];

// Shows one question and its 4 answer buttons.
// `picked` is the answer the player tapped (or null if not answered yet).
export default function QuestionCard({ question, picked, onPick, accent }) {
  const answered = picked !== null;

  const statusFor = (answer) => {
    if (!answered) return 'idle';
    if (answer === question.correct_answer) return 'correct';
    if (answer === picked) return 'wrong';
    return 'dimmed';
  };

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.answers}>
        {question.answers.map((answer, i) => (
          <AnswerButton
            key={answer}
            label={answer}
            letter={LETTERS[i]}
            status={statusFor(answer)}
            disabled={answered}
            onPress={() => onPick(answer)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    gap: 20,
    overflow: 'hidden',
  },
  accentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  question: { color: colors.text, fontSize: 22, fontFamily: font.bold, lineHeight: 30 },
  answers: { gap: 12 },
});
