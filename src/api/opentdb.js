// Fetches fresh questions from the Open Trivia DB (https://opentdb.com).
// Any failure resolves to null so the app can quietly use its built-in questions.
const ENDPOINT = 'https://opentdb.com/api.php';
const TIMEOUT_MS = 8000;
const MIN_GAP_MS = 5500; // the service allows one request every 5 seconds

let lastRequestAt = 0;

const decode = (text) => decodeURIComponent(text);

export async function fetchQuestions(categoryId, amount = 5) {
  if (Date.now() - lastRequestAt < MIN_GAP_MS) return null;
  lastRequestAt = Date.now();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${ENDPOINT}?amount=${amount}&category=${categoryId}&type=multiple&encode=url3986`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.response_code !== 0 || !Array.isArray(data.results) || data.results.length < amount) {
      return null;
    }

    return data.results.map((r) => ({
      question: decode(r.question),
      correct_answer: decode(r.correct_answer),
      incorrect_answers: r.incorrect_answers.map(decode),
    }));
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
