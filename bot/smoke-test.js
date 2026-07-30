/**
 * Smoke-test: keyboard + forward to psychologist (TELEGRAM_CHAT_ID).
 */
require("dotenv").config();
const {
  notifyAdmin,
  BTN_BOOK,
  BTN_ASK,
  BTN_PAY,
  START_KEYBOARD,
} = require("./index.js");

async function api(method, body) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || method);
  return data.result;
}

async function main() {
  const buttons = START_KEYBOARD.reply_markup.keyboard.flat().map((b) => b.text);
  for (const b of [BTN_BOOK, BTN_ASK, BTN_PAY]) {
    if (!buttons.includes(b)) throw new Error("missing button: " + b);
  }
  console.log("keyboard OK:", [BTN_BOOK, BTN_ASK, BTN_PAY].join(" | "));

  const admin = process.env.TELEGRAM_CHAT_ID;
  if (!admin) throw new Error("TELEGRAM_CHAT_ID missing");

  await api("sendMessage", {
    chat_id: admin,
    text:
      "<b>Конструктор Личности</b> — проверка меню бота\n\n" +
      "На клавиатуре ниже должны быть три функции (только в боте, не на сайте).",
    parse_mode: "HTML",
    ...START_KEYBOARD,
  });
  console.log("menu message OK");

  const ok1 = await notifyAdmin(
    "🆕 <b>Заявка на консультацию</b> (smoke)\n\nИмя: Тест\nКонтакт: +79990001122\nКомментарий: проверка записи"
  );
  const ok2 = await notifyAdmin(
    "❓ <b>Вопрос из бота</b> (smoke)\n\nТестовый вопрос: всё ли работает?"
  );
  const ok3 = await notifyAdmin(
    "💳 <b>Оплата сеанса</b> (smoke)\n\nОплата тестового сеанса"
  );
  const ok4 = await notifyAdmin("✅ Smoke-test: запись / вопрос / оплата — пересылка OK");

  if (![ok1, ok2, ok3, ok4].every(Boolean)) throw new Error("notifyAdmin failed");
  console.log("forward OK → chat", admin);
}

main().catch((e) => {
  console.error("SMOKE FAIL:", e.message);
  process.exit(1);
});
