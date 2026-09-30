import { Component, OnInit, inject } from '@angular/core';
import { NEWS_DATA } from '../../models/news.data';
import { NewsItem, NEWS_PLACEHOLDER_IMAGE } from '../../models/news.model';
import { TelegramNewsService } from '../../core/telegram-news.service';
import { LanguageService } from '../../core/language.service';
import { pickLang, hasLang, markImageBroken } from '../../core/news-lang.util';
import { pickTopicImage, trackVerifiedImages } from '../../core/news-topic.util';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

const PREVIEW_COUNT = 3;

@Component({
    selector: 'app-news-preview',
    imports: [TranslateModule, RouterModule],
    templateUrl: './news-preview.component.html',
    styleUrl: './news-preview.component.scss'
})
export class NewsPreviewComponent implements OnInit {
  /**
   * Пусто, пока не пришли настоящие новости — раньше здесь сразу стоял NEWS_DATA
   * (старые локальные образцы с фото), из-за чего при загрузке на долю секунды
   * показывались не те новости, а затем список резко менялся на актуальный.
   */
  private news: NewsItem[] = [];
  loading = true;
  readonly pickLang = pickLang;
  readonly onImageError = markImageBroken;

  private readonly telegramNews = inject(TelegramNewsService);
  private readonly language = inject(LanguageService);
  private readonly verifiedImages = new Set<NewsItem['id']>();

  get currentLang(): string {
    return this.language.current;
  }

  thumbSrc(n: NewsItem): string {
    const unverified = n.image !== NEWS_PLACEHOLDER_IMAGE && !this.verifiedImages.has(n.id);
    return pickTopicImage(n, this.currentLang, unverified);
  }

  /** Первые PREVIEW_COUNT постов, у которых вообще есть текст на текущем языке. */
  get visibleNews(): NewsItem[] {
    return this.news.filter(n => hasLang(n.title, this.currentLang)).slice(0, PREVIEW_COUNT);
  }

  ngOnInit() {
    this.telegramNews.getNews().subscribe(remote => {
      this.news = [...NEWS_DATA.map(n => ({ ...n })), ...remote].sort((a, b) => b.date.localeCompare(a.date));
      this.loading = false;
      trackVerifiedImages(this.news, this.verifiedImages);
    });
  }
}
