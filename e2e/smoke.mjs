/**
 * Smoke-прогон по живому приложению: поднимает dev-сервер, водит по нему
 * headless-Chromium и проверяет то, что юнит-тесты не видят — реальные
 * заголовки вкладок, работу 404, мета-теги и переключение языка.
 *
 *   npm run smoke                          # поднимет сервер сам
 *   BASE_URL=http://localhost:4200 npm run smoke   # по уже запущенному
 */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = Number(process.env.PORT ?? 4300);
const BASE = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const OWN_SERVER = !process.env.BASE_URL;
const SERVER_TIMEOUT_MS = 180_000;

const checks = [];

function check(name, actual, expected) {
  const ok = actual === expected;
  checks.push({ ok, name, actual, expected });
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}` + (ok ? '' : `\n         ожидалось: ${expected}\n         получено:  ${actual}`));
}

async function waitForServer(url) {
  const deadline = Date.now() + SERVER_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // сервер ещё поднимается
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`dev-сервер не ответил за ${SERVER_TIMEOUT_MS / 1000} с: ${url}`);
}

function startServer() {
  // detached — чтобы убить всю группу: ng serve порождает дочерние процессы
  const child = spawn('npx', ['ng', 'serve', '--port', String(PORT)], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', () => {});
  child.stderr.on('data', d => process.stderr.write(d));
  return child;
}

function stopServer(child) {
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    // уже умер
  }
}

/** Снимок того, что видит пользователь на странице. */
async function open(page, path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  return {
    path: new URL(page.url()).pathname,
    title: await page.title(),
    robots: await page.locator('meta[name="robots"]').getAttribute('content').catch(() => null),
    is404: (await page.locator('.not-found-card .code').count()) > 0
  };
}

const server = OWN_SERVER ? startServer() : null;
let browser;

try {
  if (server) {
    console.log(`Поднимаю dev-сервер на ${BASE} …`);
  }
  await waitForServer(BASE);

  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

  // Считаем только свои ошибки: на /projects встроен сторонний iframe
  // (hydro.krpro.kz), который шумит своими 403 и Highcharts.
  const consoleErrors = [];
  const isOurs = url => typeof url === 'string' && url.startsWith(BASE);
  page.on('console', m => {
    if (m.type() === 'error' && isOurs(m.location()?.url)) consoleErrors.push(m.text());
  });
  page.on('pageerror', e => {
    if (isOurs(e.stack) || (e.stack ?? '').includes(BASE)) consoleErrors.push(String(e));
  });

  console.log('\nМаршруты и заголовки вкладок');
  const home = await open(page, '/');
  check('/ редиректит на /home', home.path, '/home');
  check('/ — заголовок сайта', home.title, 'HydroGeo — Гидрогеология Казахстана');

  const about = await open(page, '/about');
  check('/about — заголовок раздела', about.title, 'О предприятии — HydroGeo');

  const news = await open(page, '/news/1');
  check('/news/1 — новость открывается', news.is404, false);
  check('/news/1 — заголовок', news.title, 'Новости — HydroGeo');

  console.log('\nСтраница 404');
  const missingNews = await open(page, '/news/999');
  check('/news/999 показывает 404', missingNews.is404, true);
  check('/news/999 сохраняет адрес', missingNews.path, '/news/999');
  check('/news/999 — noindex', missingNews.robots, 'noindex, follow');
  check('/news/999 — заголовок', missingNews.title, 'Страница не найдена — HydroGeo');

  const unknown = await open(page, '/nesushchestvuyushchiy-put');
  check('неизвестный путь показывает 404', unknown.is404, true);
  check('неизвестный путь сохраняет адрес', unknown.path, '/nesushchestvuyushchiy-put');
  check('неизвестный путь — noindex', unknown.robots, 'noindex, follow');

  const afterNotFound = await open(page, '/services');
  check('noindex снят при уходе с 404', afterNotFound.robots, null);

  console.log('\nЯзык');
  await page.goto(BASE + '/about', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('hydro-site:lang'));
  await page.reload({ waitUntil: 'networkidle' });
  const ru = (await page.locator('h1').first().textContent()).trim();
  check('русский по умолчанию', ru, 'О предприятии');

  await page.locator('.lang button', { hasText: 'EN' }).click();
  await page.waitForTimeout(600);
  const en = (await page.locator('h1').first().textContent()).trim();
  check('EN не показывает сырые ключи', en.includes('.'), false);
  check('выбор языка сохранён', await page.evaluate(() => localStorage.getItem('hydro-site:lang')), 'en');

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const afterReload = (await page.locator('h1').first().textContent()).trim();
  check('язык пережил перезагрузку', afterReload, en);

  // Главная проверка: текст обязан действительно поменяться. Фолбэк на ru
  // делает непереведённую страницу неотличимой от переведённой, и без этой
  // проверки пустой en.json выглядит как рабочее переключение.
  console.log('\nПеревод страниц на EN');
  const RU_LETTERS = /[а-яё]/i;
  for (const path of ['/home', '/about', '/services', '/contacts', '/projects', '/vacancies']) {
    await page.evaluate(() => localStorage.setItem('hydro-site:lang', 'ru'));
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const before = await page.locator('main, body').first().innerText();

    await page.locator('.lang button', { hasText: 'EN' }).click();
    await page.waitForTimeout(700);
    const after = await page.locator('main, body').first().innerText();

    check(`${path} — текст меняется на EN`, after !== before, true);
    // хвосты кириллицы допустимы: имена, новости и биографии живут в данных
    const ratio = after.split('\n').filter(l => RU_LETTERS.test(l)).length / Math.max(after.split('\n').length, 1);
    check(`${path} — кириллицы в EN меньше половины`, ratio < 0.5, true);
  }

  console.log('\nКонсоль');
  check('нет ошибок в консоли', consoleErrors.join(' | ') || '—', '—');
} finally {
  await browser?.close();
  if (server) stopServer(server);
}

const failed = checks.filter(c => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} проверок прошло`);
process.exit(failed.length ? 1 : 0);
