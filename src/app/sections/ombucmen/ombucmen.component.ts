
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-ombucmen',
    imports: [TranslateModule],
    templateUrl: './ombucmen.component.html',
    styleUrl: './ombucmen.component.scss'
})
export class OmbucmenComponent {
isVisible = false;
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
