import { Component, OnInit, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NEWS_DATA } from '../../models/news.data';
import { NewsItem, NEWS_PLACEHOLDER_IMAGE } from '../../models/news.model';
import { TelegramNewsService } from '../../core/telegram-news.service';
import { LanguageService } from '../../core/language.service';
import { pickLang, hasLang, markImageBroken } from '../../core/news-lang.util';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

const PAGE_SIZE = 8;

@Component({
    selector: 'app-news',
    imports: [TranslateModule, RouterModule, NgTemplateOutlet],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  isVisible = false;
  news: NewsItem[] = NEWS_DATA.map(n => ({ ...n }));
  readonly pickLang = pickLang;
  readonly onImageError = markImageBroken;

  companyLimit = PAGE_SIZE;
  industryLimit = PAGE_SIZE;

  isPlaceholder(image: string): boolean {
    return image === NEWS_PLACEHOLDER_IMAGE;
  }

  private readonly telegramNews = inject(TelegramNewsService);
  private readonly language = inject(LanguageService);

  get currentLang(): string {
    return this.language.current;
  }

  /** Посты без текста на текущем языке (например, kz-only из Telegram) не показываем вовсе. */
  get visibleNews(): NewsItem[] {
    return this.news.filter(n => hasLang(n.title, this.currentLang));
  }

  /** Свои новости — ручные (wp-admin) и старые из NEWS_DATA, без пометки source: 'telegram'. */
  get companyNews(): NewsItem[] {
    return this.visibleNews.filter(n => n.source !== 'telegram');
  }

  /** Автопостинг из Telegram-канала министерства. */
  get industryNews(): NewsItem[] {
    return this.visibleNews.filter(n => n.source === 'telegram');
  }

  get visibleCompanyNews(): NewsItem[] {
    return this.companyNews.slice(0, this.companyLimit);
  }

  get visibleIndustryNews(): NewsItem[] {
    return this.industryNews.slice(0, this.industryLimit);
  }

  showMoreCompany(): void {
    this.companyLimit += PAGE_SIZE;
  }

  showMoreIndustry(): void {
    this.industryLimit += PAGE_SIZE;
  }

  ngOnInit() {
    this.telegramNews.getNews().subscribe(remote => {
      this.news = [...NEWS_DATA.map(n => ({ ...n })), ...remote].sort((a, b) => b.date.localeCompare(a.date));
    });

    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
