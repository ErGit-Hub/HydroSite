import { LocalizedText, NewsItem, NEWS_PLACEHOLDER_IMAGE } from '../models/news.model';

/** Строка — как есть; карта по языкам — текущий язык, иначе ru/kz/en по очереди. */
export function pickLang(value: LocalizedText, lang: string): string {
  if (typeof value === 'string') {
    return value;
  }
  return value[lang as 'ru' | 'kz' | 'en'] ?? value.ru ?? value.kz ?? value.en ?? '';
}

/**
 * Строка доступна в любом языке (не завязана на конкретный перевод).
 * Карта — доступна, только если для этого языка реально есть текст:
 * посты из Telegram, где есть только казахский, не должны показываться
 * (даже с текстом-«заглушкой») в русском/английском интерфейсе.
 */
export function hasLang(value: LocalizedText, lang: string): boolean {
  if (typeof value === 'string') {
    return true;
  }
  return !!value[lang as 'ru' | 'kz' | 'en'];
}

/**
 * Ссылки на картинки из Telegram CDN со временем протухают — откатываемся на плейсхолдер.
 * Ничего не делает, если уже на плейсхолдере (защита от повторного срабатывания, если
 * протухнет и сам плейсхолдер).
 */
export function markImageBroken(item: NewsItem): void {
  if (item.image !== NEWS_PLACEHOLDER_IMAGE) {
    item.image = NEWS_PLACEHOLDER_IMAGE;
  }
}
