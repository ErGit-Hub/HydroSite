import { Component, OnInit, inject } from '@angular/core';
import { NEWS_DATA } from '../../models/news.data';
import { NewsItem, NEWS_PLACEHOLDER_IMAGE } from '../../models/news.model';
import { TelegramNewsService } from '../../core/telegram-news.service';
import { LanguageService } from '../../core/language.service';
import { pickLang } from '../../core/news-lang.util';

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
  news: NewsItem[] = NEWS_DATA.slice(0, PREVIEW_COUNT);
  readonly pickLang = pickLang;

  isPlaceholder(image: string): boolean {
    return image === NEWS_PLACEHOLDER_IMAGE;
  }

  private readonly telegramNews = inject(TelegramNewsService);
  private readonly language = inject(LanguageService);

  get currentLang(): string {
    return this.language.current;
  }

  ngOnInit() {
    this.telegramNews.getNews().subscribe(remote => {
      this.news = [...NEWS_DATA, ...remote]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, PREVIEW_COUNT);
    });
  }
}
