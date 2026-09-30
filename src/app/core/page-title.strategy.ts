import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Подставляет `title` маршрута (ключ i18n, см. app.routes.ts) в <title>, добавляя
 * название сайта. Переключение языка не вызывает навигацию, поэтому заголовок
 * дополнительно обновляется по translate.onLangChange — на последнем снапшоте.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private lastSnapshot: RouterStateSnapshot | null = null;

  constructor() {
    super();
    this.translate.onLangChange.subscribe(() => {
      if (this.lastSnapshot) {
        this.apply(this.lastSnapshot);
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastSnapshot = snapshot;
    this.apply(snapshot);
  }

  private apply(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    const siteName = this.translate.instant('SITE.NAME');
    const page = key ? this.translate.instant(key) : '';
    this.title.setTitle(page ? `${page} — ${siteName}` : siteName);
  }
}
