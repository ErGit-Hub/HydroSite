import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NEWS_DATA } from '../../../models/news.data';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-news-details',
    imports: [CommonModule, TranslateModule, RouterModule],
    templateUrl: './news-details.component.html',
    styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent  {
isVisible = false;
 newsItem: any;
 
   constructor(private route: ActivatedRoute) {}
ngOnInit() {
   const id = Number(this.route.snapshot.paramMap.get('id'));

    this.newsItem = NEWS_DATA.find(n => n.id === id);
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}

}

