# Собери Себя Сам — Конструктор личности

Лендинг психологического консультирования (КПТ, гештальт, коучинг).

**Сайт:** https://stengachanga.github.io/design_yourself/

## Локальный запуск

```bash
python -m http.server 8080
```

Откройте http://localhost:8080

## Источники контента и бренда

- `Site description.txt` — тексты
- `Label.jpg` — логотип и палитра
- `Psychologist.jpg` — фото

### Палитра (из label)

| Токен | Hex |
|-------|-----|
| Navy | `#203850` |
| Teal | `#488088` |
| Accent (CTA) | `#D07840` |
| Background | `#F4F4EF` |

## Контакты

Настройки в `js/config.js`: email, phone, telegram, Formspree endpoint.

## Telegram

Запись только через форму на сайте. При деплое в `config.js` подставляются Secrets:

- `TELEGRAM_BOT_TOKEN` — token бота
- `TELEGRAM_CHAT_ID` — chat_id психолога (куда приходят заявки)

Диалоговый бот (опционально): см. [`bot/README.md`](bot/README.md)

## Яндекс.Метрика

Счётчик **110553308**. Цели: `cta_hero_click`, `cta_contact_click`, `form_submit`, `scroll_approach`, `scroll_about`, `scroll_contact`.

## GitHub Pages

Push в `main` → workflow `.github/workflows/deploy.yml`.
