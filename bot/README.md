# Telegram-бот «Конструктор Личности»

## Возможности

- 📅 Записаться на консультацию
- ❓ Задать вопрос
- 💳 Оплатить сеанс

Все заявки и свободные сообщения клиентов пересылаются психологу в `TELEGRAM_CHAT_ID`.

## Настройка

1. [@BotFather](https://t.me/BotFather) → `/newbot` → token  
2. Напишите боту `/start`, затем узнайте chat_id:  
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. `cp .env.example .env` и заполните:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_USERNAME=Stenga4
TELEGRAM_CHAT_ID=75264340
TELEGRAM_PAYMENT_URL=https://...
TELEGRAM_PAYMENT_DETAILS=карта / СБП ...
```

4. Запуск:

```bash
cd bot
npm install
npm start
```

Нужен постоянный хостинг (Railway, Render, Fly.io, VPS).

## Сайт

На лендинге только публичный `telegramUsername` в `js/config.js`.  
Токен на фронт не кладётся — запись через кнопку «Перейти в Telegram-бота».
