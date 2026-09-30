
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-about',
    imports: [TranslateModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
isVisible = false;

/** Названия и описания лежат в i18n под ABOUT_DETAILS.DOCS.<key>. */
documents = [
  { key: 'CHARTER', file: 'assets/docs/Устав НАО НГС Казгидрогеология 2026.pdf' }
];

ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
