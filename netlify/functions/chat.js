// netlify/functions/chat.js
// Эта функция выполняется на сервере Netlify, а не в браузере пользователя.
// Ключ GROQ_API_KEY берётся из переменных окружения и никогда не попадает в код,
// который видит клиент.

exports.handler = async function (event) {
  // Разрешаем только POST-запросы
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GROQ_API_KEY не настроен на сервере' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Некорректный JSON' }) };
  }

  const { message, userContext } = payload;

  if (!message || typeof message !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Поле message обязательно' }) };
  }

  // Формируем системный промпт с контекстом пользователя, если он есть
  const systemPrompt = userContext
    ? `Ты — дружелюбный ассистент по подбору университетов. Контекст о пользователе: ${JSON.stringify(userContext)}`
    : 'Ты — дружелюбный ассистент по подбору университетов.';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b', // llama-3.3-70b-versatile снята с поддержки Groq 16.08.2026 — проверяйте актуальный список на console.groq.com/docs/models
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Ошибка при обращении к Groq API' })
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Не удалось получить ответ.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error('Server error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Внутренняя ошибка сервера' })
    };
  }
};
