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

  const { userId, subscription } = payload;
  if (!userId || !subscription || !subscription.endpoint) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Не хватает данных подписки.' }) };
  }

  try {
    const store = getStore('leo-push-subscriptions');
    await store.setJSON(userId, subscription);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Не удалось сохранить подписку: ' + err.message }) };
  }
};
