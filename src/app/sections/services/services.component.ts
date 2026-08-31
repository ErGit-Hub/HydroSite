
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-services',
    imports: [TranslateModule],
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
})
export class ServicesComponent {
isVisible = false;
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
