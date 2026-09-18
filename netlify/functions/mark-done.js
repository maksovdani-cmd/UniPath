// netlify/functions/mark-done.js
// Отмечает на сервере, что пользователь сдал сегодняшнюю миссию Лео.
// Нужно, чтобы Scheduled Function send-reminders.js не слала напоминание тем,
// кто уже всё сделал сегодня — так как localStorage браузера серверу не виден.

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ success: false }) };
  }

  const { userId, dayKey } = payload;
  if (!userId || !dayKey) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Не хватает данных.' }) };
  }

  try {
    const store = getStore('leo-completion-status');
    await store.set(userId, dayKey);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: err.message }) };
  }
};
