# Telegram-бот записи на консультацию

## 1. Создайте бота

1. Откройте [@BotFather](https://t.me/BotFather) → `/newbot`
2. Задайте имя и username (например `soberi_sebya_sam_bot`)
3. Скопируйте **token**

## 2. Параметры получателя заявок

1. Напишите боту любое сообщение
2. Откройте в браузере:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Найдите `"chat":{"id": ...}` — это `TELEGRAM_CHAT_ID`
4. Ваш публичный логин Telegram — это `TELEGRAM_ADMIN_USERNAME` (без `@`)

В `bot/.env`:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_USERNAME=Stenga4
TELEGRAM_CHAT_ID=75264340
```

Бот пересылает заявки на `TELEGRAM_CHAT_ID`. Логин нужен для проверки и документации.

## 3. Сайт

Запись только через форму. Token и chat_id подставляются при деплое из GitHub Secrets (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) — не коммитьте их в репозиторий.

## 4. Диалоговый бот (опционально)

```bash
cd bot
cp .env.example .env
# заполните TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_USERNAME, TELEGRAM_CHAT_ID
npm install
npm start
```

Команды бота:
- `/start` — приветствие
- «Записаться на консультацию» / `/book` — диалог: имя → контакт → комментарий
- «О подходе» / `/about`

Заявки из диалога уходят админу в `TELEGRAM_CHAT_ID`.
