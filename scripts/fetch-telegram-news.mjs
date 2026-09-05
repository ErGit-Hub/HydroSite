#!/usr/bin/env node
// Тянет новые посты из публичного веб-превью Telegram-канала (t.me/s/<канал>),
// раскладывает их по языкам и дописывает в src/assets/news/telegram-news.json.
// Без бота и токенов — канал не наш, только чтение публичной страницы.
//
// Запуск: node scripts/fetch-telegram-news.mjs
// Переменные окружения:
//   TELEGRAM_CHANNEL     — юзернейм канала (по умолчанию QR_Su_resurstari_ministrligi)
//   LIBRETRANSLATE_URL   — адрес LibreTranslate для ru→en (по умолчанию http://localhost:5000)

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CHANNEL = process.env.TELEGRAM_CHANNEL || 'QR_Su_resurstari_ministrligi';
const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
const STATE_FILE = path.join(__dirname, 'state.json');
const OUTPUT_FILE = path.join(ROOT, 'src/assets/news/telegram-news.json');
const PLACEHOLDER_IMAGE = 'assets/images/logo.svg';
const MIN_TEXT_LENGTH = 40;

// Буквы, которых нет в русской кириллице — по ним отличаем казахский абзац от русского.
const KZ_CHARS = /[әғқңөұүһіӘҒҚҢӨҰҮҺІ]/;

async function main() {
  const state = await readState();
  const html = await fetchChannelHtml(CHANNEL);
  const posts = parsePosts(html, CHANNEL);

  if (state.lastId === null) {
    // Первый запуск: не тащим всю историю канала, берём только то, что появится дальше.
    const maxId = posts.reduce((m, p) => Math.max(m, p.numId), 0);
    await writeState({ lastId: maxId });
    console.log(`Первый запуск: запоминаю lastId=${maxId}, новых постов не публикую.`);
    return;
  }

  const fresh = posts.filter(p => p.numId > state.lastId);
  if (fresh.length === 0) {
    console.log('Новых постов нет.');
    return;
  }

  const existing = await readExisting();
  const existingIds = new Set(existing.map(n => n.id));

  const built = [];
  for (const post of fresh) {
    const item = await buildNewsItem(post);
    if (item && !existingIds.has(item.id)) {
      built.push(item);
    }
  }

  const merged = [...existing, ...built];
  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(merged, null, 2) + '\n', 'utf8');

  const maxId = fresh.reduce((m, p) => Math.max(m, p.numId), state.lastId);
  await writeState({ lastId: maxId });

  console.log(`Добавлено новостей: ${built.length}. Всего в файле: ${merged.length}.`);
}

async function readState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf8'));
  } catch {
    return { lastId: null };
  }
}

async function writeState(state) {
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUTPUT_FILE, 'utf8'));
  } catch {
    return [];
  }
}

async function fetchChannelHtml(channel) {
  const res = await fetch(`https://t.me/s/${channel}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; hydrogeo-news-bot/1.0)' }
  });
  if (!res.ok) {
    throw new Error(`Не удалось получить t.me/s/${channel}: HTTP ${res.status}`);
  }
  return res.text();
}

function parsePosts(html, channel) {
  const posts = [];
  const blockRe = /<div class="tgme_widget_message[^"]*"[^>]*data-post="([^"]+)"[\s\S]*?(?=<div class="tgme_widget_message[^"]*"[^>]*data-post="|$)/g;

  let match;
  while ((match = blockRe.exec(html))) {
    const dataPost = match[1];
    const block = match[0];
    const numId = Number(dataPost.split('/').pop());
    if (!Number.isFinite(numId)) continue;

    const time = /<time[^>]*datetime="([^"]+)"/.exec(block)?.[1] ?? null;
    const textMatch = /tgme_widget_message_text js-message_text"[^>]*>([\s\S]*?)<\/div>/.exec(block);
    const rawText = textMatch ? htmlToText(textMatch[1]) : '';

    const image =
      /tgme_widget_message_photo_wrap"\s+style="background-image:url\('([^']+)'\)/.exec(block)?.[1] ??
      /tgme_widget_message_video_thumb"\s+style="background-image:url\('([^']+)'\)/.exec(block)?.[1] ??
      null;

    posts.push({
      id: `tg-${numId}`,
      numId,
      url: `https://t.me/${channel}/${numId}`,
      date: time ? time.slice(0, 10) : null,
      rawText,
      image
    });
  }

  return posts;
}

function htmlToText(fragment) {
  return fragment
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Абзацы (разделены пустой строкой) раскладываются по языку — RU или KZ.
 * Декоративные строки-разделители («➖➖➖», emoji без слов) не содержат ни одной
 * буквы — их пропускаем, иначе такая строка по умолчанию попадёт в RU и
 * станет заголовком вместо настоящего первого предложения.
 */
function splitByLang(rawText) {
  const paragraphs = rawText
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p && /\p{L}/u.test(p));

  const byLang = { ru: [], kz: [] };
  for (const p of paragraphs) {
    byLang[KZ_CHARS.test(p) ? 'kz' : 'ru'].push(p);
  }
  return byLang;
}

function buildLangFields(paragraphs) {
  if (paragraphs.length === 0) return null;

  const firstLine = paragraphs[0].split('\n')[0].slice(0, 140).trim();
  const joined = paragraphs.join('\n\n');
  const preview = joined.replace(/\s+/g, ' ').slice(0, 220).trim();
  const fullContent = paragraphs
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('\n');

  return { title: firstLine, preview, content: joined, fullContent };
}

async function translateToEn(text) {
  try {
    const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'ru', target: 'en', format: 'text' })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.translatedText ?? null;
  } catch (err) {
    console.warn('LibreTranslate недоступен, пропускаю перевод на английский:', err.message);
    return null;
  }
}

async function buildNewsItem(post) {
  if (post.rawText.length < MIN_TEXT_LENGTH) {
    return null; // служебный пост без содержательного текста (подпись канала и т.п.)
  }

  const byLang = splitByLang(post.rawText);
  const ruFields = buildLangFields(byLang.ru);
  const kzFields = buildLangFields(byLang.kz);

  if (!ruFields && !kzFields) {
    return null;
  }

  let enFields = null;
  if (ruFields) {
    const [title, preview, fullContent] = await Promise.all([
      translateToEn(ruFields.title),
      translateToEn(ruFields.preview),
      translateToEn(ruFields.content)
    ]);
    if (title && preview && fullContent) {
      enFields = {
        title,
        preview,
        content: fullContent,
        fullContent: `<p>${escapeHtml(fullContent).replace(/\n/g, '<br>')}</p>`
      };
    }
  }

  const pick = key => {
    const map = {};
    if (ruFields) map.ru = ruFields[key];
    if (kzFields) map.kz = kzFields[key];
    if (enFields) map.en = enFields[key];
    return map;
  };

  return {
    id: post.id,
    title: pick('title'),
    preview: pick('preview'),
    content: pick('content'),
    fullContent: pick('fullContent'),
    image: post.image ?? PLACEHOLDER_IMAGE,
    date: post.date ?? new Date().toISOString().slice(0, 10),
    source: 'telegram',
    sourceUrl: post.url
  };
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
