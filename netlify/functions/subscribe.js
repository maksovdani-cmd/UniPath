// netlify/functions/subscribe.js
// Сохраняет push-подписку браузера на сервере, привязанную к анонимному userId
// (генерируется один раз на устройстве и хранится в localStorage).
// Использует Netlify Blobs — встроенное хранилище ключ-значение, отдельный аккаунт не нужен.

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Метод не поддерживается.' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Некорректный запрос.' }) };
  }

  const { userId, subscription, notifyHourUTC } = payload;
  if (!userId || !subscription || !subscription.endpoint) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Не хватает данных подписки.' }) };
  }

  const record = {
    subscription,
    notifyHourUTC: Number.isInteger(notifyHourUTC) ? notifyHourUTC : 14 // соответствует 20:00 в Бишкеке (UTC+6), если клиент почему-то не передал час
  };

  try {
    const store = getStore('leo-push-subscriptions');
    await store.setJSON(userId, record);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Не удалось сохранить подписку: ' + err.message }) };
  }
};
