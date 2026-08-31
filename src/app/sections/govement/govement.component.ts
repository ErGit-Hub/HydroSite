
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-govement',
    imports: [TranslateModule],
    templateUrl: './govement.component.html',
    styleUrl: './govement.component.scss'
})
export class GovementComponent {
isVisible = false;
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
