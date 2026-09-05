import { Component, OnInit, inject } from '@angular/core';
import { NEWS_DATA } from '../../models/news.data';
import { NewsItem, NEWS_PLACEHOLDER_IMAGE } from '../../models/news.model';
import { TelegramNewsService } from '../../core/telegram-news.service';
import { LanguageService } from '../../core/language.service';
import { pickLang } from '../../core/news-lang.util';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-news',
    imports: [TranslateModule, RouterModule],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  isVisible = false;
  news: NewsItem[] = NEWS_DATA;
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
      this.news = [...NEWS_DATA, ...remote].sort((a, b) => b.date.localeCompare(a.date));
    });

    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
