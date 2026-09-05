import { LocalizedText } from '../models/news.model';

/** Строка — как есть; карта по языкам — текущий язык, иначе ru/kz/en по очереди. */
export function pickLang(value: LocalizedText, lang: string): string {
  if (typeof value === 'string') {
    return value;
  }
  return value[lang as 'ru' | 'kz' | 'en'] ?? value.ru ?? value.kz ?? value.en ?? '';
}
