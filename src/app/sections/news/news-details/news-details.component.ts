import { Component, OnInit, inject } from '@angular/core';
import { NEWS_DATA } from '../../../models/news.data';
import { NewsItem } from '../../../models/news.model';
import { TelegramNewsService } from '../../../core/telegram-news.service';
import { LanguageService } from '../../../core/language.service';
import { pickLang } from '../../../core/news-lang.util';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-news-details',
    imports: [CommonModule, TranslateModule, RouterModule],
    templateUrl: './news-details.component.html',
    styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent implements OnInit {
  isVisible = false;
  newsItem: NewsItem | undefined;
  readonly pickLang = pickLang;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly telegramNews = inject(TelegramNewsService);
  private readonly language = inject(LanguageService);

  get currentLang(): string {
    return this.language.current;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    this.telegramNews.getNews().subscribe(remote => {
      const all = [...NEWS_DATA, ...remote];
      this.newsItem = all.find(n => String(n.id) === id);

      if (!this.newsItem) {
        // Маршрут `news/:id` совпал, поэтому `**` уже не сработает.
        // Адрес в строке оставляем — так видно, на какой ссылке ошибка.
        this.router.navigate(['/404'], { skipLocationChange: true });
        return;
      }

      setTimeout(() => {
        this.isVisible = true;
      }, 50);
    });
  }
}
