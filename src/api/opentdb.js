// Fetches fresh questions from the Open Trivia DB (https://opentdb.com).
// Always resolves to { status, questions }, where status is:
//   'ok'    – questions is a list of questions
//   'busy'  – too many requests right now, worth retrying shortly
//   'empty' – the category has no questions to give
//   'error' – no connection, timeout or an unexpected reply
const ENDPOINT = 'https://opentdb.com/api.php';
const TIMEOUT_MS = 8000;
const MIN_GAP_MS = 5500; // the service allows one request every 5 seconds

let lastRequestAt = 0;

const decode = (text) => decodeURIComponent(text);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchQuestions(categoryId, amount = 5) {
  // Space requests out ourselves so quick replays do not hit the limit.
  const wait = MIN_GAP_MS - (Date.now() - lastRequestAt);
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${ENDPOINT}?amount=${amount}&category=${categoryId}&type=multiple&encode=url3986`;
    const res = await fetch(url, { signal: controller.signal });
    if (res.status === 429) return { status: 'busy' };
    if (!res.ok) return { status: 'error' };

    const data = await res.json();
    if (data.response_code === 5) return { status: 'busy' };
    if (data.response_code === 1) return { status: 'empty' };
    if (data.response_code !== 0 || !Array.isArray(data.results)) return { status: 'error' };
    if (data.results.length === 0) return { status: 'empty' };

    return {
      status: 'ok',
      questions: data.results.map((r) => ({
        question: decode(r.question),
        correct_answer: decode(r.correct_answer),
        incorrect_answers: r.incorrect_answers.map(decode),
      })),
    };
  } catch {
    return { status: 'error' };
  } finally {
    clearTimeout(timer);
  }
}
