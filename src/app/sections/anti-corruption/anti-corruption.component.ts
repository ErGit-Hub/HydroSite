
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-anti-corruption',
    imports: [TranslateModule],
    templateUrl: './anti-corruption.component.html',
    styleUrl: './anti-corruption.component.scss'
})
export class AntiCorruptionComponent {
isVisible = false;
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
