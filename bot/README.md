# Telegram-бот «Конструктор Личности»

## Возможности

- 📅 Записаться на консультацию (`/start book`)
- ❓ Задать вопрос (`/start ask`)
- 💳 Оплатить сеанс (`/start pay`) — только после согласования

Заявки и сообщения пересылаются в `TELEGRAM_CHAT_ID`.

**Запускайте только один инстанс** (локально *или* хостинг). Два `npm start` дают `409 Conflict`.

## Настройка

```bash
cd bot
cp .env.example .env
# заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
npm install
npm start
```

Deep links с сайта: `https://t.me/<bot>?start=book`

Политика: `TELEGRAM_PRIVACY_URL` (по умолчанию страница на GitHub Pages).
