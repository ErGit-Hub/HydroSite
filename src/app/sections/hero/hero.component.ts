
import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-hero',
    imports: [TranslateModule, RouterModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss'
})
export class HeroComponent  implements AfterViewInit {

  ngAfterViewInit() {
    const el = document.querySelector('.hero');
    if (el) {
      el.classList.remove('fade-in');

      // принудительный reflow
      void (el as HTMLElement).offsetWidth;

      el.classList.add('fade-in');
    }
  }
}
