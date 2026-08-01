# Конструктор Личности

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
| Accent (CTA) | `#B85830` |
| Background | `#F4F4EF` |

## Контакты

Настройки в `js/config.js`: telegram username бота.

## Telegram

Запись через бота: `telegramUsername` в `js/config.js`.
CTA открывает `https://t.me/<bot>?start=book`.

Бот (token только в `bot/.env`): см. [`bot/README.md`](bot/README.md). Один инстанс polling.

## Яндекс.Метрика

Счётчик **110553308**. Цели: `cta_hero_click`, `cta_contact_click`, `cta_sticky_click`, `scroll_*`.

## GitHub Pages

Push в `main` → `.github/workflows/deploy.yml`.

## Ревью

- `openspec/changes/gestalt-therapy-landing/reviews-agents.md`
- Skill AppSec: `.cursor/skills/review-appsec/SKILL.md`
