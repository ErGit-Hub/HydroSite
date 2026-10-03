
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-activity',
    imports: [TranslateModule],
    templateUrl: './activity.component.html',
    styleUrl: './activity.component.scss'
})
export class ActivityComponent {
isVisible = false;

/** Полный перечень видов деятельности — п.16 Устава НАО «НГС «Казгидрогеология». */
fullListKeys = ['ITEM_1', 'ITEM_2', 'ITEM_3', 'ITEM_4', 'ITEM_5', 'ITEM_6', 'ITEM_7', 'ITEM_8', 'ITEM_9', 'ITEM_10', 'ITEM_11', 'ITEM_12'];

ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
