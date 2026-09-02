import { DOCUMENT, Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/** Языки названы на самих себе — так их узнаёт носитель, а не только полиглот. */
export const LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'kz', label: 'Қазақша' },
  { code: 'en', label: 'English' }
] as const;

export const DEFAULT_LANG = 'ru';

const STORAGE_KEY = 'hydro-site:lang';

/** Единственная точка, где выбирается активный язык интерфейса. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  /** Восстанавливает язык из localStorage. Вызывается один раз при старте. */
  init(): void {
    this.use(this.stored() ?? DEFAULT_LANG);
  }

  get current(): string {
    return this.translate.currentLang || DEFAULT_LANG;
  }

  get currentLabel(): string {
    return LANGUAGES.find(l => l.code === this.current)?.label ?? '';
  }

  use(lang: string): void {
    const next = LANGUAGES.some(l => l.code === lang) ? lang : DEFAULT_LANG;
    this.translate.use(next);

    // Без этого скринридеры и поисковики читают страницу как англоязычную:
    // в index.html атрибут проставлен один раз и сам не меняется.
    this.document.documentElement.lang = next;

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // приватный режим — выбор просто не переживёт перезагрузку
    }
  }

  private stored(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
