import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

import { NewsItem } from '../models/news.model';

/**
 * Файл обновляет GitHub Actions каждые ~30 минут, отдельно от сборки сайта,
 * поэтому его нельзя кэшировать надолго — иначе новые новости не появятся
 * без пересборки. Пока файла нет (автоматика ещё не подложила ни одной
 * новости) — 404, и это нормально, отдаём пустой список.
 */
@Injectable({ providedIn: 'root' })
export class TelegramNewsService {
  private readonly http = inject(HttpClient);

  getNews(): Observable<NewsItem[]> {
    return this.http
      .get<NewsItem[]>(`assets/news/telegram-news.json?t=${Date.now()}`)
      .pipe(catchError(() => of([])));
  }
}
