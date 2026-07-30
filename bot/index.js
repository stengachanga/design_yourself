/**
 * Telegram-бот «Конструктор Личности».
 *
 * Функции: запись на консультацию, задать вопрос, оплатить сеанс.
 * Все заявки и сообщения клиентов пересылаются психологу (TELEGRAM_CHAT_ID).
 *
 * Хостинг: нужен постоянный процесс (Railway, Render, Fly.io, VPS) — npm start
 */
require("dotenv").config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ADMIN_USERNAME = (process.env.TELEGRAM_ADMIN_USERNAME || "")
  .trim()
  .replace(/^@/, "")
  .toLowerCase();
const PAYMENT_URL = (process.env.TELEGRAM_PAYMENT_URL || "").trim();
const PAYMENT_DETAILS = (process.env.TELEGRAM_PAYMENT_DETAILS || "").trim();

if (!TOKEN) {
  console.error("Задайте TELEGRAM_BOT_TOKEN в .env");
  process.exit(1);
}

if (!ADMIN_CHAT_ID || String(ADMIN_CHAT_ID).includes("PLACEHOLDER")) {
  console.warn("TELEGRAM_CHAT_ID не задан — пересылка психологу отключена.");
}

const API = `https://api.telegram.org/bot${TOKEN}`;
const sessions = new Map();

const BTN_BOOK = "📅 Записаться на консультацию";
const BTN_ASK = "❓ Задать вопрос";
const BTN_PAY = "💳 Оплатить сеанс";
const BTN_ABOUT = "ℹ️ О подходе";
const BTN_CANCEL = "↩️ В меню";

const START_KEYBOARD = {
  reply_markup: {
    keyboard: [[{ text: BTN_BOOK }], [{ text: BTN_ASK }], [{ text: BTN_PAY }], [{ text: BTN_ABOUT }]],
    resize_keyboard: true,
  },
};

const CANCEL_KEYBOARD = {
  reply_markup: {
    keyboard: [[{ text: BTN_CANCEL }]],
    resize_keyboard: true,
  },
};

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

function clientLabel(msg) {
  const name = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ");
  const username = msg.from.username ? `@${msg.from.username}` : "—";
  return { name: name || "—", username, chatId: msg.chat.id };
}

function isAdminChat(chatId) {
  return ADMIN_CHAT_ID && String(chatId) === String(ADMIN_CHAT_ID);
}

async function notifyAdmin(text) {
  if (!ADMIN_CHAT_ID || String(ADMIN_CHAT_ID).includes("PLACEHOLDER")) {
    console.warn("notifyAdmin skipped: TELEGRAM_CHAT_ID empty");
    return false;
  }
  try {
    await send(ADMIN_CHAT_ID, text);
    return true;
  } catch (e) {
    console.error("notifyAdmin:", e.message);
    return false;
  }
}

function paymentInstructions() {
  const parts = ["<b>Оплата сеанса</b>\n"];
  if (PAYMENT_URL) {
    parts.push(`Ссылка для оплаты:\n${PAYMENT_URL}\n`);
  }
  if (PAYMENT_DETAILS) {
    parts.push(`Реквизиты:\n${PAYMENT_DETAILS}\n`);
  }
  if (!PAYMENT_URL && !PAYMENT_DETAILS) {
    parts.push(
      "Реквизиты уточнит психолог после вашего сообщения.\n" +
        "Напишите коротко: что оплачиваете и удобный способ связи."
    );
  } else {
    parts.push("После оплаты напишите сюда комментарий (ФИО плательщика / дата сеанса) — я передам психологу.");
  }
  return parts.join("\n");
}

async function handleMessage(msg) {
  if (!msg || msg.chat.type !== "private") return;

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();
  const client = clientLabel(msg);
  const fromLogin = (msg.from.username || "").toLowerCase();

  if (isAdminChat(chatId)) {
    await send(
      chatId,
      "Это чат психолога для входящих заявок. Клиенты пишут боту в личку — сюда приходят пересылки."
    );
    return;
  }

  if (
    ADMIN_USERNAME &&
    fromLogin === ADMIN_USERNAME &&
    ADMIN_CHAT_ID &&
    String(chatId) !== String(ADMIN_CHAT_ID)
  ) {
    console.warn(
      `Админ @${ADMIN_USERNAME} пишет из chat_id=${chatId}, в .env TELEGRAM_CHAT_ID=${ADMIN_CHAT_ID}`
    );
  }

  if (text === "/start" || text === "/help" || text === BTN_CANCEL) {
    sessions.delete(chatId);
    await send(
      chatId,
      `<b>Конструктор Личности</b>\n\n` +
        `Психологическое консультирование: КПТ, гештальт, коучинг.\n\n` +
        `Выберите действие:`,
      START_KEYBOARD
    );
    return;
  }

  if (text === BTN_ABOUT || text === "/about") {
    await send(
      chatId,
      `<b>Задача:</b> не пересобрать, а структурировать.\n\n` +
        `<b>Методы:</b> КПТ, гештальт, коучинг — классические научно обоснованные подходы.\n\n` +
        `Гарантии: безопасное пространство, прозрачный сеттинг, конфиденциальность.`,
      START_KEYBOARD
    );
    return;
  }

  if (text === BTN_BOOK || text === "/book") {
    sessions.set(chatId, { flow: "book", step: "name" });
    await send(chatId, "Как к вам обращаться? Напишите имя.", CANCEL_KEYBOARD);
    return;
  }

  if (text === BTN_ASK || text === "/ask") {
    sessions.set(chatId, { flow: "ask", step: "question" });
    await send(chatId, "Напишите ваш вопрос одним сообщением.", CANCEL_KEYBOARD);
    return;
  }

  if (text === BTN_PAY || text === "/pay") {
    sessions.set(chatId, { flow: "pay", step: "note" });
    await send(chatId, paymentInstructions(), CANCEL_KEYBOARD);
    return;
  }

  const session = sessions.get(chatId);
  if (!session) {
    await notifyAdmin(
      `💬 <b>Сообщение из бота</b>\n\n` +
        `${text || "(без текста)"}\n\n` +
        `Telegram: ${client.name} (${client.username})\n` +
        `chat_id: <code>${chatId}</code>`
    );
    await send(
      chatId,
      "Сообщение передано психологу. Или выберите действие в меню.",
      START_KEYBOARD
    );
    return;
  }

  if (session.flow === "book") {
    if (session.step === "name") {
      session.name = text.slice(0, 80);
      session.step = "contact";
      await send(chatId, "Оставьте телефон или email для связи.", CANCEL_KEYBOARD);
      return;
    }
    if (session.step === "contact") {
      session.contact = text.slice(0, 120);
      session.step = "comment";
      await send(
        chatId,
        "Коротко опишите запрос (или напишите «—», если пока без деталей).",
        CANCEL_KEYBOARD
      );
      return;
    }
    if (session.step === "comment") {
      session.comment = text === "—" ? "" : text.slice(0, 500);
      sessions.delete(chatId);
      await notifyAdmin(
        `🆕 <b>Заявка на консультацию</b>\n\n` +
          `Имя: ${session.name}\n` +
          `Контакт: ${session.contact}\n` +
          `Комментарий: ${session.comment || "—"}\n` +
          `Telegram: ${client.name} (${client.username})\n` +
          `chat_id: <code>${chatId}</code>`
      );
      await send(
        chatId,
        `Спасибо, ${session.name}! Заявка принята.\nСвяжусь с вами в течение 24 часов в рабочие дни.`,
        START_KEYBOARD
      );
      return;
    }
  }

  if (session.flow === "ask" && session.step === "question") {
    sessions.delete(chatId);
    await notifyAdmin(
      `❓ <b>Вопрос из бота</b>\n\n` +
        `${text.slice(0, 2000)}\n\n` +
        `Telegram: ${client.name} (${client.username})\n` +
        `chat_id: <code>${chatId}</code>`
    );
    await send(
      chatId,
      "Вопрос передан психологу. Ответ придёт в рабочие дни.",
      START_KEYBOARD
    );
    return;
  }

  if (session.flow === "pay" && session.step === "note") {
    sessions.delete(chatId);
    await notifyAdmin(
      `💳 <b>Оплата сеанса</b>\n\n` +
        `${text.slice(0, 1000)}\n\n` +
        `Telegram: ${client.name} (${client.username})\n` +
        `chat_id: <code>${chatId}</code>`
    );
    await send(
      chatId,
      "Спасибо! Сообщение об оплате передано психологу. Он подтвердит поступление.",
      START_KEYBOARD
    );
    return;
  }

  sessions.delete(chatId);
  await send(chatId, "Выберите действие в меню.", START_KEYBOARD);
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
