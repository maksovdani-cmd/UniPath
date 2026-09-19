// netlify/functions/ai-check.js
// Проверяет ответ пользователя на ежедневную миссию Лео:
//  1) длина ответа (мин. 20 слов)
//  2) дубликаты / повторы из истории (penguin_history)
//  3) финальная проверка смысла ответа через AI + дружелюбное сообщение от Лео
//
// Требует переменную окружения AI_API_KEY (Anthropic API key), заданную в настройках Netlify.

const MIN_WORDS = 20;
const DUPLICATE_SIMILARITY_THRESHOLD = 0.75; // 0..1, доля общих слов с прошлым ответом

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeWords(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter(Boolean);
}

// Простая оценка похожести двух текстов по пересечению множества слов (Jaccard)
function similarity(a, b) {
  const setA = new Set(normalizeWords(a));
  const setB = new Set(normalizeWords(b));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

function findDuplicate(answer, history) {
  return history.find((pastText) => similarity(answer, pastText) >= DUPLICATE_SIMILARITY_THRESHOLD);
}

// Groq использует OpenAI-совместимый формат Chat Completions API
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function askLeoAI(answer, mission, hintExample) {
  const apiKey = process.env.AI_API_KEY || process.env.GROQ_API_KEY;

  // Если ключ не настроен, не блокируем пользователя — просто пропускаем AI-проверку
  // и возвращаем базовое поздравление, чтобы функция не ломала UX.
  if (!apiKey) {
    console.error('AI_API_KEY / GROQ_API_KEY не найден в переменных окружения Netlify.');
    return {
      success: true,
      message: '🎉 Миссия засчитана! (⚠️ Внимание: AI-ключ не настроен на сервере — Лео пока не проверяет ответы по-настоящему. Добавь переменную AI_API_KEY в Site settings → Environment variables на Netlify и сделай redeploy.)'
    };
  }

  const systemPrompt = `Ты — Leo, дружелюбный пингвин-помощник в приложении UniPath AI для абитуриентов.
Тебе дают формулировку ежедневной миссии, пример-подсказку, которую студент мог увидеть в приложении, и ответ студента.
Оцени, действительно ли ответ похож на честную, конкретную попытку выполнить именно эту миссию
(не пустая отписка, не спам, не набор случайных слов, соответствует теме миссии).
ВАЖНО: если ответ студента — это просто переписанный или слегка перефразированный пример-подсказка (совпадают конкретные детали/слова из примера, а не своя реальная ситуация), это НЕДОПУСТИМО — считай такой ответ невалидным (success=false) и вежливо объясни, что пример был просто иллюстрацией, а нужно описать свою реальную работу.
Отвечай СТРОГО в формате JSON без каких-либо пояснений до или после, без markdown-разметки:
{"success": true or false, "message": "короткое дружелюбное сообщение от Лео на русском языке, 1-2 предложения, с эмодзи"}
Если success=true — искренне похвали студента и упомяни конкретную деталь из его ответа.
Если success=false — мягко объясни, что не так, и предложи, как улучшить ответ. Никогда не будь грубым.`;

  const userPrompt = `Миссия: "${mission}"\nПример-подсказка, показанная студенту (её нельзя просто переписывать): "${hintExample || 'нет'}"\nОтвет студента: "${answer}"`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 300,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI API вернул статус ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content?.trim() || '';

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      success: Boolean(parsed.success),
      message: parsed.message || (parsed.success ? '🎉 Миссия засчитана!' : 'Попробуй ответить чуть подробнее.')
    };
  } catch (err) {
    // Если AI недоступен или вернул невалидный JSON — не блокируем пользователя,
    // засчитываем ответ по базовым проверкам (длина + дубликаты уже пройдены выше).
    console.error('Ошибка вызова Groq API:', err.message);
    return {
      success: true,
      message: '🎉 Отлично, миссия засчитана! Лео гордится тобой. (⚠️ AI-проверка дала сбой, смотри логи функции на Netlify)'
    };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Метод не поддерживается.' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Некорректный запрос.' })
    };
  }

  const answer = (payload.answer || '').toString();
  const mission = (payload.mission || '').toString();
  const history = Array.isArray(payload.history) ? payload.history.map(String) : [];
  const hintExample = (payload.hintExample || '').toString();

  if (!answer.trim() || !mission.trim()) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, message: 'Не хватает данных — попробуй отправить ответ ещё раз.' })
    };
  }

  // 1) Проверка длины
  const words = wordCount(answer);
  if (words < MIN_WORDS) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        message: `Пиши чуть подробнее 🙂 Нужно минимум ${MIN_WORDS} слов, а у тебя сейчас ${words}.`
      })
    };
  }

  // 2) Проверка дубликатов относительно истории
  const duplicate = findDuplicate(answer, history);
  if (duplicate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        message: 'Похоже, это очень похоже на один из твоих прошлых ответов 🐧 Расскажи что-то новое, что ты сделал(а) именно сегодня!'
      })
    };
  }

  // 2.5) Проверка, не переписал ли студент просто пример-подсказку Лео
  if (hintExample && similarity(answer, hintExample) >= DUPLICATE_SIMILARITY_THRESHOLD) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        message: 'Это же пример, который я сам тебе показал! 🐧 Опиши свою реальную ситуацию, а не переписывай подсказку.'
      })
    };
  }

  // 3) Финальная смысловая проверка через AI + сообщение от Лео
  const aiResult = await askLeoAI(answer, mission, hintExample);

  return {
    statusCode: 200,
    body: JSON.stringify(aiResult)
  };
};
