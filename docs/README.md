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

Настройки в `js/config.js`:
- Telegram: `@personalityconstructor`
- Email: `personalityconstructor@mail.ru`

Кнопки на сайте открывают чат Telegram или `mailto:` — без бота.

## Telegram

Опциональный бот для внутренних сценариев: [`bot/README.md`](bot/README.md) (token только в `bot/.env`). На лендинге CTA ведут в личный чат `@personalityconstructor`.

## Аналитика

Счётчики на сайте отключены: персональные данные посетителей не собираются.

## GitHub Pages

Push в `main` → `.github/workflows/deploy.yml`.

## Ревью

- `openspec/changes/gestalt-therapy-landing/reviews-agents.md`
- Skill AppSec: `.cursor/skills/review-appsec/SKILL.md`
