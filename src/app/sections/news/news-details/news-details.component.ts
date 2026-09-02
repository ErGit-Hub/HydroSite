import { Component, OnInit, inject } from '@angular/core';
import { NEWS_DATA } from '../../../models/news.data';
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
  newsItem: any;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.newsItem = NEWS_DATA.find(n => n.id === id);

    if (!this.newsItem) {
      // Маршрут `news/:id` совпал, поэтому `**` уже не сработает.
      // Адрес в строке оставляем — так видно, на какой ссылке ошибка.
      this.router.navigate(['/404'], { skipLocationChange: true });
      return;
    }

    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
