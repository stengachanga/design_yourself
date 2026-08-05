/**
 * Telegram-бот «Конструктор Личности» — канал привлечения и записи.
 * Сайт продаёт оффер; бот снимает трение и ведёт диалог.
 *
 * Только ОДИН инстанс (локально ИЛИ хостинг).
 *
 * Админ → клиент: ответьте на пересылку бота текстом
 * или командой: /reply <chat_id> текст
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
const SESSION_PRICE = (process.env.TELEGRAM_SESSION_PRICE || "от 5 000 ₽").trim();
const SESSION_DURATION = (process.env.TELEGRAM_SESSION_DURATION || "50 минут").trim();
const SITE_URL =
  (process.env.TELEGRAM_SITE_URL || "").trim() ||
  "https://stengachanga.github.io/design_yourself/";

if (!TOKEN) {
  console.error("Задайте TELEGRAM_BOT_TOKEN в .env");
  process.exit(1);
}

if (!ADMIN_CHAT_ID || String(ADMIN_CHAT_ID).includes("PLACEHOLDER")) {
  console.warn("TELEGRAM_CHAT_ID не задан — пересылка психологу отключена");
}

const API = `https://api.telegram.org/bot${TOKEN}`;
const sessions = new Map();
const rateBucket = new Map();
const recentClients = new Map();

const BTN_BOOK = "Записаться";
const BTN_ASK = "Задать вопрос";
const BTN_FIRST = "Что будет на встрече";
const BTN_PAY = "Оплатить сеанс";
const BTN_CANCEL = "В меню";

const START_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: BTN_BOOK }, { text: BTN_ASK }],
      [{ text: BTN_FIRST }],
      [{ text: BTN_PAY }],
    ],
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
    disable_web_page_preview: true,
    ...extra,
  });
}

function clientLabel(msg) {
  const name = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ");
  const username = msg.from.username ? `@${msg.from.username}` : "—";
  return { name: name || "—", username, chatId: msg.chat.id };
}

function rememberClient(chatId, client) {
  recentClients.set(String(chatId), { ...client, at: Date.now() });
}

function clientNotifyFooter(client, chatId) {
  const link =
    client.username !== "—"
      ? `Профиль: https://t.me/${client.username.replace(/^@/, "")}`
      : "Профиль: без username";
  return (
    `Telegram: ${escapeHtml(client.name)} (${escapeHtml(client.username)})\n` +
    `${link}\n` +
    `Ответ: reply на это сообщение или /reply ${escapeHtml(chatId)} текст`
  );
}

function isAdminChat(chatId) {
  return ADMIN_CHAT_ID && String(chatId) === String(ADMIN_CHAT_ID);
}

function allowMessage(chatId) {
  const now = Date.now();
  const key = String(chatId);
  const bucket = rateBucket.get(key) || [];
  const fresh = bucket.filter((t) => now - t < 60_000);
  if (fresh.length >= 8) {
    rateBucket.set(key, fresh);
    return false;
  }
  fresh.push(now);
  rateBucket.set(key, fresh);
  return true;
}

async function notifyAdmin(text, opts = {}) {
  if (!ADMIN_CHAT_ID || String(ADMIN_CHAT_ID).includes("PLACEHOLDER")) {
    console.warn("notifyAdmin skipped: TELEGRAM_CHAT_ID empty");
    return false;
  }
  try {
    const sent = await send(ADMIN_CHAT_ID, text);
    if (opts.clientChatId) {
      recentClients.set("last", { chatId: opts.clientChatId, notifyId: sent.message_id });
    }
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
    `<b>Оплата сеанса</b>\n`,
    `Сессия: ${escapeHtml(SESSION_DURATION)}, ${escapeHtml(SESSION_PRICE)}\n`,
    `Оплата — только после согласования даты с психологом\n`,
  ];
  if (PAYMENT_URL) parts.push(`Ссылка:\n${escapeHtml(PAYMENT_URL)}\n`);
  if (PAYMENT_DETAILS) parts.push(`Реквизиты:\n${escapeHtml(PAYMENT_DETAILS)}\n`);
  if (!PAYMENT_URL && !PAYMENT_DETAILS) {
    parts.push("Реквизиты придут после согласования слота\nНапишите, что оплачиваете, или пришлите скрин");
  } else {
    parts.push("После оплаты — комментарий или скрин\nПодтверждение поступления ≠ начало консультации");
  }
  return parts.join("\n");
}

function welcomeText() {
  return (
    `<b>Конструктор Личности</b>\n\n` +
    `Цель: не пересобрать, а структурировать\n` +
    `Различаем, что в вашей власти, и действуем\n\n` +
    `Онлайн · ${escapeHtml(SESSION_DURATION)} · ${escapeHtml(SESSION_PRICE)}\n` +
    `Ответ — в течение 24 часов\n\n` +
    `Не медицина и не экстренная помощь\n` +
    `Угроза жизни: 112 · доверие: 8-800-2000-122\n\n` +
    `Сайт: ${escapeHtml(SITE_URL)}\n` +
    `Политика: ${escapeHtml(PRIVACY_URL)}\n\n` +
    `Выберите действие — или напишите, что важно сейчас:`
  );
}

function firstMeetingText() {
  return (
    `<b>Первая встреча</b>\n\n` +
    `• 50 минут онлайн\n` +
    `• проясняем запрос и рамки\n` +
    `• учитываем сферу вашего опыта — психология в госслужбе, бизнесе и науке разная\n` +
    `• без давления\n` +
    `• дальше решаете вы — продолжать или нет\n\n` +
    `Готовы — «Записаться». Сомневаетесь — «Задать вопрос»`
  );
}

async function startBook(chatId) {
  sessions.set(chatId, { flow: "book", step: "name" });
  await send(
    chatId,
    `Запись на консультацию.\n\nКак к вам обращаться?\n(продолжая, вы соглашаетесь с политикой: ${escapeHtml(PRIVACY_URL)})`,
    CANCEL_KEYBOARD
  );
}

async function startAsk(chatId) {
  sessions.set(chatId, { flow: "ask", step: "question" });
  await send(
    chatId,
    "Напишите вопрос одним сообщением.\nЭто бесплатно и ни к чему не обязывает",
    CANCEL_KEYBOARD
  );
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

function extractReplyTarget(adminText, replyTo) {
  const cmd = adminText.match(/^\/reply\s+(\d+)\s+([\s\S]+)$/i);
  if (cmd) return { chatId: cmd[1], text: cmd[2].trim() };

  if (replyTo && replyTo.text) {
    const idMatch = replyTo.text.match(/\/reply\s+(\d+)\s+текст/i) ||
      replyTo.text.match(/chat_id[^0-9]*(\d{5,})/i) ||
      replyTo.text.match(/\b(\d{6,})\b/);
    if (idMatch && adminText && !adminText.startsWith("/")) {
      return { chatId: idMatch[1], text: adminText };
    }
  }

  const last = recentClients.get("last");
  if (last && adminText.startsWith("/reply ") && !cmd) {
    return null;
  }
  return null;
}

async function handleAdmin(msg) {
  const text = messageText(msg);
  const target = extractReplyTarget(text, msg.reply_to_message);
  if (target && target.text) {
    try {
      await send(target.chatId, `Ответ психолога:\n\n${escapeHtml(target.text)}`);
      await send(msg.chat.id, `Отправлено клиенту <code>${escapeHtml(target.chatId)}</code>`);
    } catch (e) {
      await send(msg.chat.id, `Не удалось отправить: ${escapeHtml(e.message)}`);
    }
    return;
  }

  await send(
    msg.chat.id,
    "Чат психолога\n\nЧтобы ответить клиенту:\n1) reply на пересылку заявки\n2) или /reply CHAT_ID текст"
  );
}

async function handleMessage(msg) {
  if (!msg || msg.chat.type !== "private") return;

  const chatId = msg.chat.id;
  const text = messageText(msg);
  const client = clientLabel(msg);
  const fromLogin = (msg.from.username || "").toLowerCase();
  const hasMedia = Boolean(msg.photo || msg.document);

  if (isAdminChat(chatId)) {
    await handleAdmin(msg);
    return;
  }

  if (!allowMessage(chatId)) {
    await send(chatId, "Слишком много сообщений подряд — подождите минуту и напишите снова");
    return;
  }

  rememberClient(chatId, client);

  if (
    ADMIN_USERNAME &&
    fromLogin === ADMIN_USERNAME &&
    ADMIN_CHAT_ID &&
    String(chatId) !== String(ADMIN_CHAT_ID)
  ) {
    console.warn(`Админ @${ADMIN_USERNAME} пишет из chat_id=${chatId}`);
  }

  const startPayload = text.startsWith("/start") ? parseStartPayload(text) : null;
  if (text === "/help" || text === BTN_CANCEL || (text.startsWith("/start") && !startPayload)) {
    sessions.delete(chatId);
    await send(chatId, welcomeText(), START_KEYBOARD);
    return;
  }

  if (text.startsWith("/start") && startPayload) {
    sessions.delete(chatId);
    if (startPayload === "book" || startPayload === "site") return startBook(chatId);
    if (startPayload === "ask") return startAsk(chatId);
    if (startPayload === "pay") return startPay(chatId);
    if (startPayload === "first") {
      await send(chatId, firstMeetingText(), START_KEYBOARD);
      return;
    }
    await send(chatId, welcomeText(), START_KEYBOARD);
    return;
  }

  if (text === BTN_BOOK || text === "/book") return startBook(chatId);
  if (text === BTN_ASK || text === "/ask") return startAsk(chatId);
  if (text === BTN_PAY || text === "/pay") return startPay(chatId);
  if (text === BTN_FIRST || text === "/first") {
    await send(chatId, firstMeetingText(), START_KEYBOARD);
    return;
  }

  const session = sessions.get(chatId);
  if (!session) {
    if (!text && !hasMedia) return;
    await notifyAdmin(
      `<b>Сообщение из бота</b>\n\n` +
        `${escapeHtml(text || "(медиа)")}\n\n` +
        clientNotifyFooter(client, chatId),
      {
        clientChatId: chatId,
        ...(hasMedia ? { copyFromChatId: chatId, messageId: msg.message_id } : {}),
      }
    );
    await send(
      chatId,
      "Передал психологу.\nМожете записаться или уточнить вопрос кнопками ниже",
      START_KEYBOARD
    );
    return;
  }

  if (session.flow === "book") {
    if (!text) {
      await send(chatId, "Нужен текст или «В меню»", CANCEL_KEYBOARD);
      return;
    }
    if (session.step === "name") {
      session.name = text.slice(0, 80);
      session.step = "contact";
      await send(chatId, "Телефон или email для связи?", CANCEL_KEYBOARD);
      return;
    }
    if (session.step === "contact") {
      session.contact = text.slice(0, 120);
      session.step = "comment";
      await send(
        chatId,
        "Коротко: с чем хотите поработать? (или «—»)",
        CANCEL_KEYBOARD
      );
      return;
    }
    if (session.step === "comment") {
      session.comment = text === "—" ? "" : text.slice(0, 500);
      sessions.delete(chatId);
      await notifyAdmin(
        `<b>Заявка на консультацию</b>\n\n` +
          `Имя: ${escapeHtml(session.name)}\n` +
          `Контакт: ${escapeHtml(session.contact)}\n` +
          `Запрос: ${escapeHtml(session.comment || "—")}\n` +
          `Условия: ${escapeHtml(SESSION_DURATION)}, ${escapeHtml(SESSION_PRICE)}\n` +
          clientNotifyFooter(client, chatId),
        { clientChatId: chatId }
      );
      await send(
        chatId,
        `${escapeHtml(session.name)}, заявка принята\nПсихолог ответит в течение 24 часов и согласует слот\n\nО встрече: «${BTN_FIRST}»`,
        START_KEYBOARD
      );
      return;
    }
  }

  if (session.flow === "ask" && session.step === "question") {
    if (!text) {
      await send(chatId, "Нужен текст вопроса или «В меню»", CANCEL_KEYBOARD);
      return;
    }
    sessions.delete(chatId);
    await notifyAdmin(
      `<b>Вопрос</b>\n\n` +
        `${escapeHtml(text.slice(0, 2000))}\n\n` +
        clientNotifyFooter(client, chatId),
      { clientChatId: chatId }
    );
    await send(
      chatId,
      "Вопрос у психолога — ответ в течение 24 часов\nДля встречи — «Записаться»",
      START_KEYBOARD
    );
    return;
  }

  if (session.flow === "pay" && session.step === "note") {
    if (!text && !hasMedia) {
      await send(chatId, "Нужен комментарий/скрин или «В меню»", CANCEL_KEYBOARD);
      return;
    }
    sessions.delete(chatId);
    await notifyAdmin(
      `<b>Оплата</b>\n\n` +
        `${escapeHtml(text.slice(0, 1000) || "(медиа)")}\n\n` +
        clientNotifyFooter(client, chatId),
      {
        clientChatId: chatId,
        ...(hasMedia ? { copyFromChatId: chatId, messageId: msg.message_id } : {}),
      }
    );
    await send(
      chatId,
      "Информацию об оплате передал. Психолог подтвердит поступление",
      START_KEYBOARD
    );
    return;
  }

  sessions.delete(chatId);
  await send(chatId, "Выберите действие в меню", START_KEYBOARD);
}

async function poll() {
  let offset = 0;
  console.log("Bot polling started… (attraction + booking, one instance)");
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
