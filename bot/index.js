/**
 * Telegram-бот записи на консультацию «Собери Себя Сам».
 *
 * Настройка:
 * 1. @BotFather → /newbot → скопируйте token
 * 2. Напишите боту /start, затем узнайте chat_id:
 *    https://api.telegram.org/bot<TOKEN>/getUpdates
 * 3. Создайте .env (см. .env.example) и запустите: npm start
 *
 * Хостинг: Railway, Render, Fly.io, VPS — нужен постоянный процесс (polling)
 * или webhook на HTTPS.
 */
require("dotenv").config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TOKEN) {
  console.error("Задайте TELEGRAM_BOT_TOKEN в .env");
  process.exit(1);
}

const API = `https://api.telegram.org/bot${TOKEN}`;
const sessions = new Map();

async function api(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || method);
  return data.result;
}

function send(chatId, text, extra = {}) {
  return api("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...extra,
  });
}

const START_KEYBOARD = {
  reply_markup: {
    keyboard: [[{ text: "📅 Записаться на консультацию" }], [{ text: "ℹ️ О подходе" }]],
    resize_keyboard: true,
  },
};

async function notifyAdmin(text) {
  if (!ADMIN_CHAT_ID || String(ADMIN_CHAT_ID).includes("PLACEHOLDER")) return;
  try {
    await send(ADMIN_CHAT_ID, text);
  } catch (e) {
    console.error("notifyAdmin:", e.message);
  }
}

async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  const name = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ");
  const username = msg.from.username ? `@${msg.from.username}` : "—";

  if (text === "/start" || text === "/help") {
    sessions.delete(chatId);
    await send(
      chatId,
      `<b>Собери Себя Сам</b> — Конструктор личности\n\n` +
        `Психологическое консультирование: КПТ, гештальт, коучинг.\n\n` +
        `Нажмите «Записаться на консультацию» или напишите /book.`,
      START_KEYBOARD
    );
    return;
  }

  if (text === "ℹ️ О подходе" || text === "/about") {
    await send(
      chatId,
      `Цель — <b>не пересобрать</b>, а <b>структурировать</b>.\n\n` +
        `Методы: КПТ, гештальт, коучинг — только классические научно обоснованные подходы.\n\n` +
        `Гарантии: безопасное пространство, прозрачный сеттинг, конфиденциальность.`
    );
    return;
  }

  if (text === "📅 Записаться на консультацию" || text === "/book") {
    sessions.set(chatId, { step: "name" });
    await send(chatId, "Как к вам обращаться? Напишите имя.");
    return;
  }

  const session = sessions.get(chatId);
  if (!session) {
    await send(chatId, "Нажмите «Записаться на консультацию» или /book.", START_KEYBOARD);
    return;
  }

  if (session.step === "name") {
    session.name = text.slice(0, 80);
    session.step = "contact";
    await send(chatId, "Оставьте телефон или email для связи.");
    return;
  }

  if (session.step === "contact") {
    session.contact = text.slice(0, 120);
    session.step = "comment";
    await send(chatId, "Коротко опишите запрос (или напишите «—», если пока без деталей).");
    return;
  }

  if (session.step === "comment") {
    session.comment = text === "—" ? "" : text.slice(0, 500);
    sessions.delete(chatId);

    const lead =
      `🆕 <b>Заявка из Telegram-бота</b>\n\n` +
      `Имя: ${session.name}\n` +
      `Контакт: ${session.contact}\n` +
      `Комментарий: ${session.comment || "—"}\n` +
      `Telegram: ${name} (${username})\n` +
      `chat_id: <code>${chatId}</code>`;

    await notifyAdmin(lead);
    await send(
      chatId,
      `Спасибо, ${session.name}! Заявка принята.\n` +
        `Свяжусь с вами в течение 24 часов в рабочие дни.`,
      START_KEYBOARD
    );
  }
}

async function poll() {
  let offset = 0;
  console.log("Bot polling started…");
  for (;;) {
    try {
      const updates = await api("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message"],
      });
      for (const u of updates) {
        offset = u.update_id + 1;
        if (u.message) await handleMessage(u.message);
      }
    } catch (e) {
      console.error("poll error:", e.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

poll();
