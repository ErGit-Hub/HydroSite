import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { LocalizedText, NewsItem, NEWS_PLACEHOLDER_IMAGE } from '../models/news.model';

const CMS_POSTS_URL = 'https://cms.hydrogeo.kz/?rest_route=/wp/v2/posts&_embed&per_page=50';

/** Мультиязычные варианты полей поста — пишет только `fetch-telegram-news.mjs`, см. scripts/fetch-telegram-news.mjs. */
interface NewsI18n {
  title: LocalizedText;
  preview: LocalizedText;
  content: LocalizedText;
  fullContent: LocalizedText;
  image?: string;
}

interface WpPost {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  meta?: { hg_i18n?: string };
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[];
  };
}

function decodeEntities(html: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function parseI18n(raw: string | undefined): NewsI18n | null {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as NewsI18n;
  } catch {
    return null;
  }
}

function mapPost(post: WpPost): NewsItem {
  const i18n = parseI18n(post.meta?.hg_i18n);
  const preview = i18n ? i18n.preview : stripTags(post.excerpt.rendered);
  return {
    id: post.id,
    title: i18n ? i18n.title : decodeEntities(post.title.rendered),
    preview,
    content: i18n ? i18n.content : preview,
    fullContent: i18n ? i18n.fullContent : post.content.rendered,
    image:
      i18n?.image ??
      post._embedded?.['wp:featuredmedia']?.[0]?.source_url ??
      NEWS_PLACEHOLDER_IMAGE,
    date: post.date.slice(0, 10),
    source: 'telegram',
  };
}

/**
 * Новости отдаёт headless WordPress (cms.hydrogeo.kz) через публичный REST API.
 * `/wp-json/...` на этом хостинге не работает (нет nginx rewrite для permalinks),
 * поэтому используется запасной путь `?rest_route=`.
 */
@Injectable({ providedIn: 'root' })
export class TelegramNewsService {
  private readonly http = inject(HttpClient);

  getNews(): Observable<NewsItem[]> {
    return this.http.get<WpPost[]>(`${CMS_POSTS_URL}&t=${Date.now()}`).pipe(
      map(posts => posts.map(mapPost)),
      catchError(() => of([])),
    );
  }
}
