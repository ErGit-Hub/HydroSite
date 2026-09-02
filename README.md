# KazHydro — сайт НАО «НГС Казгидрогеология»

Одностраничное приложение (SPA) на Angular 21 для Национальной гидрогеологической
службы Республики Казахстан: информация о предприятии, направления деятельности,
проекты, новости, вакансии и антикоррупционный блок.

Интерфейс мультиязычный: русский (по умолчанию), казахский и английский.

## Требования

- Node.js 20.19+, 22.12+ или 24+ (`engines` у Angular 21; нечётные
  релизы — 21.x, 23.x — не поддерживаются)
- npm 10+

## Запуск

```bash
npm install
npm start          # dev-сервер на http://localhost:4200
```

Остальные команды:

```bash
npm run build      # продакшн-сборка в dist/hydro-site/browser
npm run build:dev  # сборка без минификации, с source maps
npm run watch      # пересборка при изменениях
npm test           # юнит-тесты (vitest)
npm run smoke      # прогон по живому приложению в headless-браузере
```

## Структура проекта

```
src/
├── app/
│   ├── app.component.*          # корневой компонент: header + router-outlet + footer
│   ├── app.config.ts            # провайдеры: роутер, HttpClient, ngx-translate
│   ├── app.routes.ts            # маршруты, заголовки страниц, lazy-загрузка
│   ├── core/                    # язык, заголовок вкладки, обработка ошибок чанков
│   ├── components/              # переиспользуемые блоки (header, footer)
│   ├── models/                  # интерфейсы и статические данные (новости)
│   ├── pages/                   # home, not-found
│   └── sections/                # страницы разделов сайта
├── assets/
│   ├── docs/                    # PDF: антикоррупционные документы, кодекс этики
│   ├── i18n/                    # ru.json, kz.json, en.json
│   └── images/                  # изображения разделов, новостей, руководства
└── styles.scss                  # глобальные стили, контейнер, анимация .fade-in

e2e/
└── smoke.mjs                    # прогон по живому приложению (npm run smoke)
```

## Маршруты

| Путь | Раздел |
| --- | --- |
| `/` | редирект на `/home` |
| `/home` | Главная |
| `/about` | О компании |
| `/activity` | Направления деятельности |
| `/govement` | Государственные задачи |
| `/services` | Услуги |
| `/structure` | Структура |
| `/reception` | Приёмная / график приёма |
| `/contacts` | Контакты |
| `/projects` | Проекты |
| `/vacancies` | Вакансии |
| `/anti-corruption` | Противодействие коррупции |
| `/ombucmen` | Омбудсмен |
| `/news`, `/news/:id` | Новости и карточка новости |
| `/404`, `**` | Страница 404 |

Все разделы подгружаются отдельными чанками (`loadComponent`). Исключение —
`/home`: её открывает каждый посетитель, поэтому она собрана в начальный бандл.
Остальные чанки докачиваются в фоне (`withPreloading(PreloadAllModules)`), так что
клик по меню не ждёт сети.

Заголовок вкладки задаётся полем `title` маршрута; `PageTitleStrategy`
(`src/app/core/page-title.strategy.ts`) добавляет к нему название сайта.

Маршрут `/404` нужен для страниц, у которых совпал путь, но не нашлись данные:
`news/:id` с несуществующим id уходит на него сам (`**` в этом случае не
срабатывает — путь-то совпал).

## Локализация

Переводы лежат в `src/assets/i18n/<lang>.json` и загружаются по HTTP через
`CustomTranslateLoader` (`src/app/core/translate.loader.ts`).

Активный язык — целиком зона ответственности `LanguageService`
(`src/app/core/language.service.ts`): он восстанавливает выбор из `localStorage`
при старте (`provideAppInitializer` в `app.config.ts`), откатывается на `ru` и
сохраняет каждое переключение. `HeaderComponent.setLang` только вызывает его —
не задавайте язык через `TranslateService.use` мимо сервиса, иначе выбор
не сохранится.

Чтобы добавить строку, внесите ключ во все три файла (`ru.json`, `kz.json`,
`en.json`) и используйте его в шаблоне: `{{ 'SECTION.KEY' | translate }}`.

> `kz.json` и `en.json` пока заполнены не полностью — основной объём текстов есть
> только в `ru.json`.

## Тесты

Тесты запускаются билдером `@angular/build:unit-test` поверх vitest в jsdom.
На каждый компонент есть smoke-тест «should create»; компонентам, использующим
`translate` или `routerLink`, в `TestBed` нужно передать `provideTranslateService()`
и `provideRouter([])` — см. `src/app/pages/not-found/not-found.component.spec.ts`.

```bash
npm test
```

### Smoke-прогон по живому приложению

`npm run smoke` (`e2e/smoke.mjs`) поднимает dev-сервер на порту 4300, водит по
нему headless-Chromium и проверяет то, чего юнит-тесты не видят: заголовки
вкладок, работу 404 на неизвестном пути и на `news/:id` с несуществующим id,
мета-тег `robots`, переключение и сохранение языка, отсутствие ошибок в консоли.
Сервер гасится сам, код выхода ненулевой при первой же непрошедшей проверке.

```bash
npm run smoke                                   # поднимет сервер сам
BASE_URL=http://localhost:4200 npm run smoke    # по уже запущенному
```

Браузер ставится отдельно от пакетов: `npx playwright install chromium`.

## Деплой

`npm run build` кладёт статику в `dist/hydro-site/browser`. Её можно раздать любым
статическим хостингом, но SPA-маршрутизация требует fallback всех неизвестных путей
на `index.html` (иначе прямой заход на `/news/3` вернёт 404 от сервера).

Fallback нужно ограничить документами. Если под него попадут скрипты и ассеты,
пропавший файл вернётся как `index.html` со статусом 200 — а это, например, ломает
навигацию после деплоя: имена чанков хэшируются (`outputHashing: "all"`), и
открытая у пользователя вкладка просит уже несуществующий чанк.

```nginx
# ассеты и чанки: пропал файл — честный 404, а не index.html
location /assets/ {
  try_files $uri =404;
}

location ~* \.(js|css|map|woff2?|ico|png|jpe?g|svg)$ {
  try_files $uri =404;
}

location / {
  try_files $uri $uri/ /index.html;
}
```

Приложение обрабатывает такой 404 само: `withNavigationErrorHandler`
(`src/app/core/chunk-load-error.ts`) перезагружает страницу по тому же адресу,
чтобы браузер получил свежий `index.html` со ссылками на новые чанки.

Статуса 404 у неизвестных путей при этом всё равно нет — их отдаёт `index.html`
с кодом 200. Чтобы опечатки в ссылках не попадали в индекс, `NotFoundComponent`
выставляет `<meta name="robots" content="noindex, follow">`.

## Заметки

- В `package.json` объявлены, но нигде в `src/` не используются: `primeng`,
  `primeicons`, `@angular/cdk`, `@angular/animations`, `@angular/forms`,
  `tailwindcss` (конфига Tailwind в проекте тоже нет). Их можно удалить.
- Данные новостей статические — `src/app/models/news.data.ts`, без бэкенда.
