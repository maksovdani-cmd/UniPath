// netlify/functions/send-reminders.js
// Netlify Scheduled Function — запускается сама по расписанию (см. netlify.toml),
// даже если ни один пользователь в этот момент не открыл сайт.
// Проверяет всех подписчиков и шлёт push тем, кто ещё не сдал сегодняшнюю миссию.
//
// Требует переменные окружения (Site settings → Environment variables на Netlify):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY — сгенерированы один раз, см. инструкцию ниже.

const webpush = require('web-push');
const { getStore } = require('@netlify/blobs');

const LEO_MISSIONS = [
  "Найди 2 extracurricular activities, которые соответствуют твоей специальности.",
  "Напиши первые 100 слов своего Personal Statement.",
  "Изучи 3 университета в разделе Universities & Chances Match и выпиши, чем они отличаются.",
  "Выучи 15 новых слов для IELTS/SAT."
];

function getLeoDayKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return `${now.getFullYear()}-${dayOfYear}`;
}

function getTodayLeoMission() {
  const [, dayOfYear] = getLeoDayKey().split('-').map(Number);
  return LEO_MISSIONS[dayOfYear % LEO_MISSIONS.length];
}

exports.handler = async () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    console.log('VAPID ключи не настроены — пропускаем рассылку.');
    return { statusCode: 200, body: 'VAPID keys not configured, skipping.' };
  }

  webpush.setVapidDetails('mailto:admin@unipath-ai.netlify.app', publicKey, privateKey);

  const subsStore = getStore('leo-push-subscriptions');
  const doneStore = getStore('leo-completion-status');
  const todayKey = getLeoDayKey();
  const missionText = getTodayLeoMission();

  const { blobs } = await subsStore.list();
  const currentUTCHour = new Date().getUTCHours();
  let sent = 0, skipped = 0, skippedHour = 0, failed = 0;

  for (const { key: userId } of blobs) {
    try {
      const record = await subsStore.get(userId, { type: 'json' });
      if (!record || !record.subscription) continue;

      const notifyHourUTC = Number.isInteger(record.notifyHourUTC) ? record.notifyHourUTC : 14;
      if (notifyHourUTC !== currentUTCHour) {
        skippedHour++;
        continue; // сейчас не тот час, который выбрал пользователь
      }

      const completedDay = await doneStore.get(userId);
      if (completedDay === todayKey) {
        skipped++;
        continue; // уже сдал(а) сегодня — не беспокоим
      }

      const payload = JSON.stringify({
        title: "Leo's Daily Mission 🐧",
        body: `Today's Mission => ${missionText}`,
        icon: '/image/leo-face.png',
        badge: '/image/leo-face.png',
        url: '/'
      });

      await webpush.sendNotification(record.subscription, payload);
      sent++;
    } catch (err) {
      failed++;
      // 410/404 — подписка больше не действительна (пользователь отписался/удалил сайт), чистим за собой
      if (err.statusCode === 410 || err.statusCode === 404) {
        await subsStore.delete(userId);
      }
    }
  }

  const summary = `Отправлено: ${sent}, пропущено (не тот час): ${skippedHour}, пропущено (уже сдали): ${skipped}, ошибок: ${failed}`;
  console.log(summary);
  return { statusCode: 200, body: summary };
};
