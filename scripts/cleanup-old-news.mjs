#!/usr/bin/env node
// Удаляет старые новости из headless WordPress (cms.hydrogeo.kz) — раздельные
// сроки хранения для «своих» новостей (Казгидрогеология) и отраслевых
// (автопостинг из Telegram-канала министерства, см. fetch-telegram-news.mjs).
//
// Деление «своя/отраслевая» — та же эвристика, что и во фронтенде
// (TelegramNewsService.mentionsCompany, src/app/core/telegram-news.service.ts):
// пост без hg_i18n (написан вручную в wp-admin) или с упоминанием
// «Казгидрогеология»/«Қазгидрогеология» в тексте — свой, остальное — отраслевое.
//
// DELETE без &force=true перемещает пост в корзину WP, а не удаляет насовсем —
// это подушка безопасности (WordPress сам подчистит корзину ещё примерно
// через 30 дней, см. EMPTY_TRASH_DAYS).
//
// Запуск: node scripts/cleanup-old-news.mjs [--dry-run]
// Переменные окружения:
//   HYDROGEO_API_KEY — секрет для запросов к WP (заголовок X-Api-Key), обязателен
//   CMS_API_URL       — REST-эндпоинт постов WP (по умолчанию cms.hydrogeo.kz)

const CMS_API_URL = process.env.CMS_API_URL || 'https://cms.hydrogeo.kz/?rest_route=/wp/v2/posts';
const API_KEY = process.env.HYDROGEO_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

const COMPANY_RETENTION_MONTHS = 6;
const INDUSTRY_RETENTION_MONTHS = 1;
const COMPANY_MENTION_RE = /казгидрогеология|қазгидрогеология/i;

async function main() {
  if (!API_KEY && !DRY_RUN) {
    throw new Error('HYDROGEO_API_KEY не задан — удалять посты нечем (для --dry-run ключ не нужен).');
  }

  const posts = await fetchAllPosts();
  const companyCutoff = monthsAgo(COMPANY_RETENTION_MONTHS);
  const industryCutoff = monthsAgo(INDUSTRY_RETENTION_MONTHS);

  let toDelete = 0;
  for (const post of posts) {
    const group = groupOf(post);
    const cutoff = group === 'company' ? companyCutoff : industryCutoff;
    const postDate = new Date(post.date);

    if (postDate >= cutoff) continue;

    toDelete++;
    const label = `#${post.id} (${group}, ${post.date.slice(0, 10)}) — ${stripTags(post.title?.rendered ?? '')}`;
    if (DRY_RUN) {
      console.log(`[dry-run] удалил бы: ${label}`);
    } else {
      await deletePost(post.id);
      console.log(`Удалено (в корзину): ${label}`);
    }
  }

  console.log(
    toDelete === 0
      ? 'Старых новостей не найдено.'
      : `Готово: ${DRY_RUN ? 'нашёл' : 'удалил'} ${toDelete} из ${posts.length} постов.`,
  );
}

/** Свой пост (Казгидрогеология) или отраслевой — та же логика, что во фронтенде. */
function groupOf(post) {
  const i18nRaw = post.meta?.hg_i18n;
  if (!i18nRaw) return 'company'; // ручной пост из wp-admin — считаем своим

  const haystack = `${i18nRaw} ${post.title?.rendered ?? ''} ${post.excerpt?.rendered ?? ''}`;
  return COMPANY_MENTION_RE.test(haystack) ? 'company' : 'industry';
}

function monthsAgo(months) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await fetch(`${CMS_API_URL}&per_page=100&page=${page}&status=publish`, {
      headers: API_KEY ? { 'X-Api-Key': API_KEY } : {},
    });
    if (!res.ok) {
      throw new Error(`Не удалось получить список постов (страница ${page}): HTTP ${res.status}`);
    }
    totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1);
    posts.push(...(await res.json()));
    page++;
  } while (page <= totalPages);

  return posts;
}

async function deletePost(id) {
  const res = await fetch(`${CMS_API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'X-Api-Key': API_KEY },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WordPress отклонил удаление поста ${id}: HTTP ${res.status} ${body}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
