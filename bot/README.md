# Telegram-бот записи на консультацию

## 1. Создайте бота

1. Откройте [@BotFather](https://t.me/BotFather) → `/newbot`
2. Задайте имя и username (например `soberi_sebya_sam_bot`)
3. Скопируйте **token**

## 2. Узнайте свой chat_id

1. Напишите боту любое сообщение
2. Откройте в браузере:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Найдите `"chat":{"id": ...}` — это `TELEGRAM_CHAT_ID` (куда приходят заявки)

## 3. Сайт

В `js/config.js` укажите только `telegramUsername` (без `@`).
Токен на фронт не кладётся: форма открывает черновик в Telegram.

## 4. Диалоговый бот (опционально)

```bash
cd bot
cp .env.example .env
# заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
npm install
npm start
```

Команды бота:
- `/start` — приветствие
- «Записаться на консультацию» / `/book` — диалог: имя → контакт → комментарий
- «О подходе» / `/about`

Заявки из диалога уходят админу в `TELEGRAM_CHAT_ID`.
