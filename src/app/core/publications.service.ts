import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

// Публикации ведутся в wp-admin (тип записей «Публикации», см. cms/mu-plugins/hg-publications.php).
// Сортировка по menu_order — редактор задаёт порядок числом. 100 — максимум WP REST за запрос.
const CMS_PUBLICATIONS_URL =
  'https://cms.hydrogeo.kz/?rest_route=/wp/v2/publications&per_page=100&orderby=menu_order&order=asc';

export interface Publication {
  /** Разметка описания: <strong> выделяет фамилии сотрудников. */
  html: string;
  doi?: string;
  tail?: string;
  /** Примечание по языкам (ru/kz/en), заполнены только непустые. */
  notes: Partial<Record<'ru' | 'kz' | 'en', string>>;
}

interface WpPublication {
  content: { rendered: string };
  meta?: {
    hg_doi?: string;
    hg_tail?: string;
    hg_scopus_q?: string;
    hg_percentile?: string;
    hg_citescore?: string;
    hg_wos_if?: string;
    hg_note_ru?: string;
    hg_note_kk?: string;
    hg_note_en?: string;
  };
}

/** WP оборачивает содержимое в <p> — в ячейке таблицы они не нужны. */
function unwrapParagraphs(html: string): string {
  return html.replace(/<\/?p[^>]*>/gi, '').trim();
}

/**
 * Рейтинги вносятся отдельными полями, скобки и подписи собираются здесь:
 * «(Quartiles: Scopus Q1, Percentile: 63, Cite Score: 4.9, WOS Impact Factor: 2.9)».
 * Подписи на английском на всех языках — как в исходном документе.
 */
function buildRating(m: NonNullable<WpPublication['meta']>): string | undefined {
  const parts = [
    m.hg_scopus_q && `Quartiles: Scopus ${m.hg_scopus_q}`,
    m.hg_percentile && `Percentile: ${m.hg_percentile}`,
    m.hg_citescore && `Cite Score: ${m.hg_citescore}`,
    m.hg_wos_if && `WOS Impact Factor: ${m.hg_wos_if}`,
  ].filter(Boolean);
  return parts.length ? `(${parts.join(', ')})` : m.hg_tail || undefined;
}

function mapPublication(post: WpPublication): Publication {
  const m = post.meta ?? {};
  const notes: Publication['notes'] = {};
  if (m.hg_note_ru) notes.ru = m.hg_note_ru;
  if (m.hg_note_kk) notes.kz = m.hg_note_kk;
  if (m.hg_note_en) notes.en = m.hg_note_en;
  return {
    html: unwrapParagraphs(post.content.rendered),
    doi: m.hg_doi || undefined,
    tail: buildRating(m),
    notes,
  };
}

@Injectable({ providedIn: 'root' })
export class PublicationsService {
  private readonly http = inject(HttpClient);

  /** Пустой список при ошибке или пустой CMS — вызывающий подставляет запасной список из кода. */
  getPublications(): Observable<Publication[]> {
    return this.http.get<WpPublication[]>(`${CMS_PUBLICATIONS_URL}&t=${Date.now()}`).pipe(
      map(posts => posts.map(mapPublication)),
      catchError(() => of([])),
    );
  }
}
