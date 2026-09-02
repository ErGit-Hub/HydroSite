import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const SUPPORTED_LANGS = ['ru', 'kz', 'en'] as const;
export const DEFAULT_LANG = 'ru';

const STORAGE_KEY = 'hydro-site:lang';

/** Единственная точка, где выбирается активный язык интерфейса. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  /** Восстанавливает язык из localStorage. Вызывается один раз при старте. */
  init(): void {
    this.use(this.stored() ?? DEFAULT_LANG);
  }

  use(lang: string): void {
    const next = (SUPPORTED_LANGS as readonly string[]).includes(lang) ? lang : DEFAULT_LANG;
    this.translate.use(next);

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
