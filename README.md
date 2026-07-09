# design_yourself — лендинг курсов гештальт-терапии

Одностраничный маркетинговый сайт для рекламы психологических курсов с акцентом на гештальт-подход.

**Сайт:** https://stengachanga.github.io/design_yourself/

## Локальный запуск

Статический сайт — достаточно открыть `index.html` в браузере или запустить локальный сервер:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Откройте http://localhost:8080

## Структура

```
├── index.html          # Главная страница
├── css/styles.css      # Стили
├── js/
│   ├── main.js         # Навигация, форма, бургер-меню
│   └── metrika.js      # Цели Яндекс.Метрики
├── assets/images/      # Изображения
└── docs/               # Копия для GitHub Pages (/docs на main)
```

## Яндекс.Метрика

Счётчик **110553308** подключён в `index.html`. Цели:

| Цель | Событие |
|------|---------|
| `cta_hero_click` | Клик «Записаться на курс» в hero |
| `cta_contact_click` | Клик CTA в карточках курсов и кнопка формы |
| `form_submit` | Успешная отправка заявки |
| `scroll_courses` | Прокрутка до секции курсов |
| `scroll_benefits` | Прокрутка до преимуществ |
| `scroll_contact` | Прокрутка до контактов |

Создайте эти цели в интерфейсе [Яндекс.Метрики](https://metrika.yandex.ru/) → Настройки → Цели.

## Telegram

Ссылка на Telegram оставлена пустой (`href=""`). Когда будет готов канал/бот:

1. Откройте `index.html`
2. Найдите `<a id="telegram-link"` и укажите URL, например `https://t.me/your_channel`
3. Удалите атрибуты `aria-disabled="true"` и `data-empty="true"`
4. Обновите текст кнопки

## GitHub Pages

### Вариант A: папка `/docs` (простой)

1. Запушьте репозиторий на GitHub
2. **Settings → Pages → Build and deployment**
3. Source: **Deploy from a branch**
4. Branch: `main`, folder: `/docs`
5. Сохраните — сайт будет доступен по адресу `https://stengachanga.github.io/design_yourself/`

Перед деплоем синхронизируйте `docs/` с корнем:

```bash
# PowerShell
Copy-Item index.html docs/
Copy-Item -Recurse css,js,assets docs/
```

### Вариант B: GitHub Actions (автоматический)

Workflow `.github/workflows/deploy.yml` деплоит при push в `main`.

1. **Settings → Pages → Source: GitHub Actions**
2. Push в `main` — workflow соберёт и опубликует сайт

### Custom domain (опционально)

1. Создайте файл `docs/CNAME` с вашим доменом: `courses.example.com`
2. Настройте DNS: CNAME на `<user>.github.io`
3. Включите HTTPS в настройках Pages

## Цены на курсах

Ориентиры взяты с рынка русскоязычных школ гештальт-терапии (2025–2026). Актуальные цены уточняйте при записи.
