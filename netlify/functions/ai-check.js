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

async function askLeoAI(answer, mission) {
  const apiKey = process.env.AI_API_KEY;

  // Если ключ не настроен, не блокируем пользователя — просто пропускаем AI-проверку
  // и возвращаем базовое поздравление, чтобы функция не ломала UX.
  if (!apiKey) {
    return {
      success: true,
      message: '🎉 Отлично, миссия засчитана! (AI-проверка временно недоступна, ключ не настроен)'
    };
  }

  const systemPrompt = `Ты — Leo, дружелюбный пингвин-помощник в приложении UniPath AI для абитуриентов.
Тебе дают формулировку ежедневной миссии и ответ студента.
Оцени, действительно ли ответ похож на честную, конкретную попытку выполнить именно эту миссию
(не пустая отписка, не спам, не набор случайных слов, соответствует теме миссии).
Отвечай СТРОГО в формате JSON без каких-либо пояснений до или после:
{"success": true or false, "message": "короткое дружелюбное сообщение от Лео на русском языке, 1-2 предложения, с эмодзи"}
Если success=true — искренне похвали студента и упомяни конкретную деталь из его ответа.
Если success=false — мягко объясни, что не так, и предложи, как улучшить ответ. Никогда не будь грубым.`;

  const userPrompt = `Миссия: "${mission}"\nОтвет студента: "${answer}"`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`AI API вернул статус ${response.status}`);
    }

    const data = await response.json();
    const rawText = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      success: Boolean(parsed.success),
      message: parsed.message || (parsed.success ? '🎉 Миссия засчитана!' : 'Попробуй ответить чуть подробнее.')
    };
  } catch (err) {
    // Если AI недоступен или вернул невалидный JSON — не блокируем пользователя,
    // засчитываем ответ по базовым проверкам (длина + дубликаты уже пройдены выше).
    return {
      success: true,
      message: '🎉 Отлично, миссия засчитана! Лео гордится тобой.'
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

  // 3) Финальная смысловая проверка через AI + сообщение от Лео
  const aiResult = await askLeoAI(answer, mission);

  return {
    statusCode: 200,
    body: JSON.stringify(aiResult)
  };
};
