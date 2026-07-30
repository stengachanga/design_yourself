## Why

Практика ведёт клиента в Telegram: веб-форма на лендинге лишняя. Нужен бот с записью, вопросами и оплатой сеанса и пересылкой психологу; спецификация должна это фиксировать.

## What Changes

- Убрать поля формы с лендинга; CTA → Telegram-бот
- Расширить бота: запись, задать вопрос, оплатить сеанс; форвард в `TELEGRAM_CHAT_ID`
- Обновить OpenSpec (`landing-page`, новая capability `telegram-bot`)
- Убрать bot token с фронта / из Pages inject

## Capabilities

### New Capabilities

- `telegram-bot`: меню и диалоги записи/вопроса/оплаты; пересылка психологу; конфиг только server-side

### Modified Capabilities

- `landing-page`: шапка «Конструктор Личности»; запись через бота без веб-формы; блок «Методы»; без «Не предлагаю»
- `analytics-integration`: цели клика CTA на открытие бота
- `github-pages-deployment`: статика без инъекции Telegram token

## Impact

- `index.html`, `js/config.js`, `js/main.js`, `bot/`, `docs/`, `.github/workflows/deploy.yml`
- OpenSpec under `openspec/changes/gestalt-therapy-landing/`
