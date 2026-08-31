import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NEWS_DATA } from '../../models/news.data';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-news',
    imports: [TranslateModule, RouterModule],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent  {
isVisible = false;
 news = NEWS_DATA;
ngOnInit() {
  
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}

}
