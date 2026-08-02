# Автопостинг «Конструктор Личности»

Публикация постов из `content/queue/` в Telegram по расписанию (GitHub Actions).

## Как это работает

1. Пишете пост в `content/queue/YYYY-MM-DD-slug.md`
2. В frontmatter: `date`, `title`, `status: queued`
3. Каждый день в **09:00 UTC** (12:00 МСК) workflow берёт **один** просроченный/сегодняшний `queued` пост и отправляет в канал
4. После успеха `status` → `posted`

## Настройка (обязательно)

1. Создайте Telegram-канал (или используйте существующий)
2. Добавьте бота `@soberi_sebya_sam_bot` **администратором** канала с правом публиковать
3. В GitHub → Settings → Secrets and variables → Actions добавьте:

| Secret | Значение |
|--------|----------|
| `TELEGRAM_BOT_TOKEN` | токен бота (как у локального бота) |
| `TELEGRAM_CHANNEL_ID` | `@your_channel` или числовой id канала (для приватных часто `-100…`) |

Узнать id: перешлите пост из канала боту [@userinfobot](https://t.me/userinfobot) / [@getidsbot](https://t.me/getidsbot) или посмотрите через `getUpdates` после сообщения в канале.

## Локальный тест

```bash
cd scripts
set TELEGRAM_BOT_TOKEN=...
set TELEGRAM_CHANNEL_ID=@your_channel
set DRY_RUN=1
node autopost-telegram.js
```

Без `DRY_RUN` — реальная отправка.

Ручной запуск в GitHub: Actions → Autopost Telegram → Run workflow.

## Тон постов

- Голос Ольги Сотовой / Конструктор Личности
- Без волшебных обещаний, без трансерфинга
- CTA на сайт и бота добавляется скриптом автоматически
