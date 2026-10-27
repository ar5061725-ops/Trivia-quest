import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useFonts } from 'expo-font';
import {
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  Rubik_800ExtraBold,
  Rubik_900Black,
} from '@expo-google-fonts/rubik';
import { NotoKufiArabic_500Medium } from '@expo-google-fonts/noto-kufi-arabic';

import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import { fetchQuestions } from './src/api/opentdb';
import { questionsByCategory } from './src/data/questions';
import { shuffle } from './src/utils/shuffle';
import { colors } from './src/theme';

const QUESTIONS_PER_GAME = 5;

// Builds a fresh game: picks 5 questions and mixes up the 4 answers of each.
function buildGame(categoryId) {
  const pool = questionsByCategory[categoryId] ?? [];
  return shuffle(pool)
    .slice(0, QUESTIONS_PER_GAME)
    .map((q) => ({ ...q, answers: shuffle([q.correct_answer, ...q.incorrect_answers]) }));
}

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'loading' | 'quiz' | 'result'
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const attemptRef = useRef(0);
  const [fontsLoaded] = useFonts({
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
    Rubik_800ExtraBold,
    Rubik_900Black,
    NotoKufiArabic_500Medium,
  });

  // Starts (or restarts) a game in a category — everything goes back to zero.
  // Tries for fresh questions online first; if that is not possible it plays the built-in set.
  const startGame = async (cat) => {
    const attempt = ++attemptRef.current;
    setCategory(cat);
    setScreen('loading');

    const fresh = await fetchQuestions(cat.id, QUESTIONS_PER_GAME);
    if (attempt !== attemptRef.current) return; // cancelled while loading

    setQuestions(
      fresh
        ? fresh.map((q) => ({ ...q, answers: shuffle([q.correct_answer, ...q.incorrect_answers]) }))
        : buildGame(cat.id)
    );
    setIndex(0);
    setScore(0);
    setPicked(null);
    setResults([]);
    setScreen('quiz');
  };

  const cancelLoading = () => {
    attemptRef.current++;
    setScreen('home');
  };

  const handlePick = (answer) => {
    if (picked !== null) return; // only the first tap counts
    setPicked(answer);
    const right = answer === questions[index].correct_answer;
    setResults((r) => [...r, right]);
    if (right) {
      setScore((s) => s + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setScreen('result');
    }
  };

  const goHome = () => setScreen('home');

  if (!fontsLoaded) return <View style={styles.safe} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />

        {screen === 'home' && <HomeScreen onSelectCategory={startGame} />}

        {screen === 'loading' && <LoadingScreen category={category} onCancel={cancelLoading} />}

        {screen === 'quiz' && (
          <QuizScreen
            category={category}
            questions={questions}
            index={index}
            score={score}
            picked={picked}
            onPick={handlePick}
            onNext={handleNext}
            onQuit={goHome}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            category={category}
            score={score}
            total={questions.length}
            results={results}
            onPlayAgain={() => startGame(category)}
            onChangeCategory={goHome}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
});
