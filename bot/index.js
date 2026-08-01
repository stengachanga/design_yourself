/**
 * Telegram-бот «Конструктор Личности».
 *
 * Функции: запись на консультацию, задать вопрос, оплатить сеанс.
 * Заявки пересылаются психологу (TELEGRAM_CHAT_ID).
 *
 * Важно: запускайте только ОДИН инстанс (локально ИЛИ хостинг), иначе 409 Conflict.
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
const PRIVACY_URL =
  (process.env.TELEGRAM_PRIVACY_URL || "").trim() ||
  "https://stengachanga.github.io/design_yourself/privacy.html";

if (!TOKEN) {
  console.error("Задайте TELEGRAM_BOT_TOKEN в .env");
  process.exit(1);
}

if (!ADMIN_CHAT_ID || String(ADMIN_CHAT_ID).includes("PLACEHOLDER")) {
  console.warn("TELEGRAM_CHAT_ID не задан — пересылка психологу отключена");
}

const API = `https://api.telegram.org/bot${TOKEN}`;
const sessions = new Map();

const BTN_BOOK = "📅 Записаться на консультацию";
const BTN_ASK = "❓ Задать вопрос";
const BTN_PAY = "💳 Оплатить сеанс";
const BTN_CANCEL = "↩️ В меню";

const START_KEYBOARD = {
  reply_markup: {
    keyboard: [[{ text: BTN_BOOK }], [{ text: BTN_ASK }], [{ text: BTN_PAY }]],
    resize_keyboard: true,
  },
};

const CANCEL_KEYBOARD = {
  reply_markup: {
    keyboard: [[{ text: BTN_CANCEL }]],
    resize_keyboard: true,
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

function clientNotifyFooter(client, chatId) {
  const link = client.username !== "—"
    ? `Профиль: https://t.me/${client.username.replace(/^@/, "")}`
    : "Профиль: без username";
  return (
    `Telegram: ${escapeHtml(client.name)} (${escapeHtml(client.username)})\n` +
    `${link}\n` +
    `Ответ клиенту: перешлите сообщение на chat_id <code>${escapeHtml(chatId)}</code>`
  );
}

function isAdminChat(chatId) {
  return ADMIN_CHAT_ID && String(chatId) === String(ADMIN_CHAT_ID);
}

async function notifyAdmin(text, opts = {}) {
  if (!ADMIN_CHAT_ID || String(ADMIN_CHAT_ID).includes("PLACEHOLDER")) {
    console.warn("notifyAdmin skipped: TELEGRAM_CHAT_ID empty");
    return false;
  }
  try {
    await send(ADMIN_CHAT_ID, text);
    if (opts.copyFromChatId && opts.messageId) {
      try {
        await api("copyMessage", {
          chat_id: ADMIN_CHAT_ID,
          from_chat_id: opts.copyFromChatId,
          message_id: opts.messageId,
        });
      } catch (e) {
        console.error("copyMessage:", e.message);
      }
    }
    return true;
  } catch (e) {
    console.error("notifyAdmin:", e.message);
    return false;
  }
}

function paymentInstructions() {
  const parts = [
    "<b>Оплата сеанса</b>\n",
    "Оплата — только после согласования даты и условий с психологом-консультантом\n",
  ];
  if (PAYMENT_URL) {
    parts.push(`Ссылка для оплаты:\n${escapeHtml(PAYMENT_URL)}\n`);
  }
  if (PAYMENT_DETAILS) {
    parts.push(`Реквизиты:\n${escapeHtml(PAYMENT_DETAILS)}\n`);
  }
  if (!PAYMENT_URL && !PAYMENT_DETAILS) {
    parts.push(
      "Реквизиты уточнит психолог после согласования\n" +
        "Напишите коротко: что оплачиваете (или пришлите скрин) и удобный способ связи"
    );
  } else {
    parts.push(
      "После оплаты напишите комментарий или пришлите скрин — я передам психологу\n" +
        "Подтверждение поступления ≠ начало консультации"
    );
  }
  return parts.join("\n");
}

function welcomeText() {
  return (
    `<b>Конструктор Личности</b>\n\n` +
    `Психологическое консультирование: КПТ, гештальт, коучинг\n` +
    `Не медицинская услуга и не экстренная помощь\n` +
    `При угрозе жизни: 112 · телефон доверия: 8-800-2000-122\n\n` +
    `Политика: ${PRIVACY_URL}\n\n` +
    `Выберите действие:`
  );
}

async function startBook(chatId) {
  sessions.set(chatId, { flow: "book", step: "name" });
  await send(
    chatId,
    `Как к вам обращаться? Напишите имя\nПродолжая, вы соглашаетесь с политикой: ${PRIVACY_URL}`,
    CANCEL_KEYBOARD
  );
}

async function startAsk(chatId) {
  sessions.set(chatId, { flow: "ask", step: "question" });
  await send(chatId, "Напишите ваш вопрос одним сообщением", CANCEL_KEYBOARD);
}

async function startPay(chatId) {
  sessions.set(chatId, { flow: "pay", step: "note" });
  await send(chatId, paymentInstructions(), CANCEL_KEYBOARD);
}

function parseStartPayload(text) {
  const m = text.match(/^\/start(?:@\w+)?(?:\s+(.+))?$/i);
  if (!m) return null;
  return (m[1] || "").trim().toLowerCase();
}

function messageText(msg) {
  return (msg.text || msg.caption || "").trim();
}

async function handleMessage(msg) {
  if (!msg || msg.chat.type !== "private") return;

  const chatId = msg.chat.id;
  const text = messageText(msg);
  const client = clientLabel(msg);
  const fromLogin = (msg.from.username || "").toLowerCase();
  const hasMedia = Boolean(msg.photo || msg.document);

  if (isAdminChat(chatId)) {
    await send(
      chatId,
      "Это чат психолога для входящих заявок — клиенты пишут боту в личку, сюда приходят пересылки"
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

  const startPayload = text.startsWith("/start") ? parseStartPayload(text) : null;
  if (text === "/help" || text === BTN_CANCEL || (text.startsWith("/start") && !startPayload)) {
    sessions.delete(chatId);
    await send(chatId, welcomeText(), START_KEYBOARD);
    return;
  }

  if (text.startsWith("/start") && startPayload) {
    sessions.delete(chatId);
    if (startPayload === "book" || startPayload === "site") {
      await startBook(chatId);
      return;
    }
    if (startPayload === "ask") {
      await startAsk(chatId);
      return;
    }
    if (startPayload === "pay") {
      await startPay(chatId);
      return;
    }
    await send(chatId, welcomeText(), START_KEYBOARD);
    return;
  }

  if (text === BTN_BOOK || text === "/book") {
    await startBook(chatId);
    return;
  }

  if (text === BTN_ASK || text === "/ask") {
    await startAsk(chatId);
    return;
  }

  if (text === BTN_PAY || text === "/pay") {
    await startPay(chatId);
    return;
  }

  const session = sessions.get(chatId);
  if (!session) {
    if (!text && !hasMedia) return;
    await notifyAdmin(
      `💬 <b>Сообщение из бота</b>\n\n` +
        `${escapeHtml(text || "(медиа без текста)")}\n\n` +
        clientNotifyFooter(client, chatId),
      hasMedia ? { copyFromChatId: chatId, messageId: msg.message_id } : {}
    );
    await send(
      chatId,
      "Сообщение передано психологу — или выберите действие в меню",
      START_KEYBOARD
    );
    return;
  }

  if (session.flow === "book") {
    if (!text) {
      await send(chatId, "Нужен текстовый ответ или нажмите «В меню»", CANCEL_KEYBOARD);
      return;
    }
    if (session.step === "name") {
      session.name = text.slice(0, 80);
      session.step = "contact";
      await send(chatId, "Оставьте телефон или email для связи", CANCEL_KEYBOARD);
      return;
    }
    if (session.step === "contact") {
      session.contact = text.slice(0, 120);
      session.step = "comment";
      await send(
        chatId,
        "Коротко опишите запрос (или напишите «—», если пока без деталей)",
        CANCEL_KEYBOARD
      );
      return;
    }
    if (session.step === "comment") {
      session.comment = text === "—" ? "" : text.slice(0, 500);
      sessions.delete(chatId);
      await notifyAdmin(
        `🆕 <b>Заявка на консультацию</b>\n\n` +
          `Имя: ${escapeHtml(session.name)}\n` +
          `Контакт: ${escapeHtml(session.contact)}\n` +
          `Комментарий: ${escapeHtml(session.comment || "—")}\n` +
          clientNotifyFooter(client, chatId)
      );
      await send(
        chatId,
        `Спасибо, ${escapeHtml(session.name)}! Заявка принята\nСвяжусь с вами в течение 24 часов`,
        START_KEYBOARD
      );
      return;
    }
  }

  if (session.flow === "ask" && session.step === "question") {
    if (!text) {
      await send(chatId, "Нужен текстовый вопрос или нажмите «В меню»", CANCEL_KEYBOARD);
      return;
    }
    sessions.delete(chatId);
    await notifyAdmin(
      `❓ <b>Вопрос из бота</b>\n\n` +
        `${escapeHtml(text.slice(0, 2000))}\n\n` +
        clientNotifyFooter(client, chatId)
    );
    await send(
      chatId,
      "Вопрос передан психологу — ответ придёт в течение 24 часов",
      START_KEYBOARD
    );
    return;
  }

  if (session.flow === "pay" && session.step === "note") {
    if (!text && !hasMedia) {
      await send(
        chatId,
        "Нужен комментарий или скрин оплаты — или нажмите «В меню»",
        CANCEL_KEYBOARD
      );
      return;
    }
    sessions.delete(chatId);
    await notifyAdmin(
      `💳 <b>Оплата сеанса</b>\n\n` +
        `${escapeHtml(text.slice(0, 1000) || "(медиа)")}\n\n` +
        clientNotifyFooter(client, chatId),
      hasMedia ? { copyFromChatId: chatId, messageId: msg.message_id } : {}
    );
    await send(
      chatId,
      "Спасибо! Сообщение об оплате передано психологу — он подтвердит поступление",
      START_KEYBOARD
    );
    return;
  }

  sessions.delete(chatId);
  await send(chatId, "Выберите действие в меню", START_KEYBOARD);
}

async function poll() {
  let offset = 0;
  console.log("Bot polling started… (only one instance should run)");
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

module.exports = {
  handleMessage,
  notifyAdmin,
  escapeHtml,
  BTN_BOOK,
  BTN_ASK,
  BTN_PAY,
  START_KEYBOARD,
};

if (require.main === module) {
  poll();
}
