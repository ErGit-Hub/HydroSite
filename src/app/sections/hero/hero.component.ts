
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

  tiltX = 0;
  tiltY = 0;

  /** Лёгкий 3D-наклон карты вслед за курсором — только на десктопе (тачу mousemove не шлёт). */
  onHeroMouseMove(event: MouseEvent, hero: HTMLElement) {
    const rect = hero.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    this.tiltY = px * 14;
    this.tiltX = -py * 9;
  }

  onHeroMouseLeave() {
    this.tiltX = 0;
    this.tiltY = 0;
  }

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
