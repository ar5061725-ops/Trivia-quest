// Asks a free OpenRouter model to turn a topic into one category with 5 multiple-choice questions.
// Always resolves to { status, category }, where status is:
//   'ok'      – category is { name, questions: [{ question, correct_answer, incorrect_answers }] }
//   'nokey'   – no API key configured (see .env.example)
//   'busy'    – the free model is rate limited right now
//   'invalid' – the model answered, but not with usable questions
//   'error'   – no connection, timeout or an unexpected reply
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.EXPO_PUBLIC_OPENROUTER_MODEL || 'openrouter/free'; // routes to an available free model
const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const TIMEOUT_MS = 60000;
const QUESTION_COUNT = 5;

const SYSTEM_PROMPT = `You write trivia quizzes. Reply with JSON only, no other text, in exactly this shape:
{"category":"short category name","questions":[{"question":"...","correct_answer":"...","incorrect_answers":["...","...","..."]}]}
Rules: exactly ${QUESTION_COUNT} questions; each has exactly 3 incorrect answers that are clearly wrong but plausible; all 4 answers of a question are different and short; the facts must be accurate; write everything in the same language as the topic.`;

// Models sometimes wrap JSON in code fences or add a sentence around it.
function parseJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

function validate(data) {
  const name = clean(data?.category);
  if (!name || !Array.isArray(data.questions) || data.questions.length < QUESTION_COUNT) return null;

  const questions = [];
  for (const q of data.questions.slice(0, QUESTION_COUNT)) {
    const question = clean(q?.question);
    const correct = clean(q?.correct_answer);
    const wrong = Array.isArray(q?.incorrect_answers) ? q.incorrect_answers.map(clean) : [];
    if (!question || !correct || wrong.length !== 3 || wrong.some((w) => !w)) return null;
    if (new Set([correct, ...wrong]).size !== 4) return null;
    questions.push({ question, correct_answer: correct, incorrect_answers: wrong });
  }
  return { name, questions };
}

export async function generateCategory(topic) {
  if (!API_KEY) return { status: 'nokey' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Topic: ${topic}` },
        ],
      }),
    });
    if (res.status === 429) return { status: 'busy' };
    if (!res.ok) return { status: 'error' };

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return { status: 'invalid' };

    const category = validate(parseJson(content));
    return category ? { status: 'ok', category } : { status: 'invalid' };
  } catch {
    return { status: 'error' };
  } finally {
    clearTimeout(timer);
  }
}
