/** Локализованный текст: либо строка «как есть», либо перевод по языкам (частично заполненный). */
export type LocalizedText = string | { ru?: string; kz?: string; en?: string };

/** Ставится в NewsItem.image, когда у поста из Telegram нет своей картинки (см. scripts/fetch-telegram-news.mjs). */
export const NEWS_PLACEHOLDER_IMAGE = 'assets/images/logo.svg';

export interface NewsItem {
  id: number | string;
  title: LocalizedText;
  preview: LocalizedText;
  content: LocalizedText;
  fullContent: LocalizedText;
  image: string;
  date: string;
  /** Откуда пришла новость: вручную в news.data.ts, или автоматически из Telegram-канала. */
  source?: 'local' | 'telegram';
  sourceUrl?: string;
}
