import { DOCUMENT, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Файлы переводов лежат по постоянному адресу `assets/i18n/<lang>.json`,
 * поэтому браузер имеет полное право отдать их из кэша после новой выкладки —
 * и показать вместо текста сами ключи (SECURITY.TITLE), которых в старом
 * файле ещё нет. Safari так и делал: он закэшировал файл до того, как на
 * сервере появился `Cache-Control: no-cache`, и без явного срока держался
 * за копию по эвристике.
 *
 * Лечится версией в адресе: у каждой сборки она своя, значит и URL другой,
 * а по новому URL кэшу нечего отдать.
 */
@Injectable()
export class CustomTranslateLoader implements TranslateLoader {
  private readonly http = inject(HttpClient);
  private readonly version = buildVersion(inject(DOCUMENT));

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}.json${this.version}`);
  }
}

/**
 * Версия берётся из имени главного бандла — `main-XID455OU.js`. Оно содержит
 * хэш содержимого и меняется при каждой сборке, отдельный счётчик версии
 * заводить не нужно. В `ng serve` хэша нет, там и кэш не мешает.
 */
function buildVersion(document: Document): string {
  const src = document.querySelector<HTMLScriptElement>('script[src*="main-"]')?.src ?? '';
  const hash = /main-([A-Z0-9]+)\.js/i.exec(src)?.[1];
  return hash ? `?v=${hash}` : '';
}
