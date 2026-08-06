#!/usr/bin/env node
/**
 * Автопостинг в Telegram-канал/чат из content/queue/*.md
 *
 * Frontmatter:
 * ---
 * date: 2026-08-03
 * title: Короткий заголовок
 * status: queued | posted | skipped
 * ---
 *
 * Текст после frontmatter уходит в Telegram (HTML: <b> <i> <a>).
 * После успеха status → posted, пишется posted_at.
 *
 * Env:
 *   TELEGRAM_BOT_TOKEN (обязательно)
 *   TELEGRAM_CHANNEL_ID — @channel или числовой id (обязательно для публикации)
 *   SITE_URL — ссылка в конце поста (опционально)
 *   DRY_RUN=1 — только показать, что отправили бы
 */
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL = (process.env.TELEGRAM_CHANNEL_ID || "").trim();
const SITE_URL =
  (process.env.SITE_URL || process.env.TELEGRAM_SITE_URL || "").trim() ||
  "https://stengachanga.github.io/design_yourself/";
const DRY = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const QUEUE_DIR = path.join(__dirname, "..", "content", "queue");
const TODAY = (process.env.AUTOPOST_DATE || new Date().toISOString().slice(0, 10)).trim();

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw.trim() };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2].trim() };
}

function serialize(meta, body) {
  const lines = Object.entries(meta).map(([k, v]) => `${k}: ${v}`);
  return `---\n${lines.join("\n")}\n---\n\n${body.trim()}\n`;
}

function listPosts() {
  if (!fs.existsSync(QUEUE_DIR)) return [];
  return fs
    .readdirSync(QUEUE_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const file = path.join(QUEUE_DIR, f);
      const raw = fs.readFileSync(file, "utf8");
      const { meta, body } = parseFrontmatter(raw);
      return { file, name: f, meta, body };
    })
    .sort((a, b) => String(a.meta.date || "").localeCompare(String(b.meta.date || "")));
}

async function sendTelegram(text) {
  const api = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHANNEL,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || "Telegram API error");
  return data.result;
}

function buildMessage(post) {
  const title = post.meta.title ? `<b>${escapeHtml(post.meta.title)}</b>\n\n` : "";
  const cta =
    `\n\n———\n` +
    `Консультация онлайн · от 5 000 ₽\n` +
    `<a href="${escapeHtml(SITE_URL)}">Записаться</a> · <a href="https://t.me/personalityconstructor">@personalityconstructor</a>`;
  return `${title}${post.body}${cta}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  if (!TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN не задан");
    process.exit(1);
  }
  if (!CHANNEL && !DRY) {
    console.error("TELEGRAM_CHANNEL_ID не задан (канал @name или chat_id)");
    process.exit(1);
  }

  const due = listPosts().filter((p) => {
    const status = (p.meta.status || "queued").toLowerCase();
    const date = p.meta.date || "";
    return status === "queued" && date && date <= TODAY;
  });

  if (!due.length) {
    console.log(`Нет постов к публикации на ${TODAY}`);
    return;
  }

  const post = due[0];
  const text = buildMessage(post);
  console.log(`Публикую ${post.name} (date=${post.meta.date})…`);

  if (DRY) {
    console.log("--- DRY RUN ---\n" + text);
    return;
  }

  await sendTelegram(text);
  post.meta.status = "posted";
  post.meta.posted_at = new Date().toISOString();
  fs.writeFileSync(post.file, serialize(post.meta, post.body), "utf8");
  console.log(`OK: ${post.name} → ${CHANNEL}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
