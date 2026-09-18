import { Component, HostListener, inject } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

import { LangSwitcherComponent } from '../lang-switcher/lang-switcher.component';
import { SHOW_DEV_BANNER } from '../../core/site-flags';

@Component({
    selector: 'app-header',
    imports: [TranslateModule, RouterModule, LangSwitcherComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  readonly showDevBanner = SHOW_DEV_BANNER;

  isMenuOpen = false;
  isScrolled = false;

  /**
   * Списки разделов раскрываются на :hover, поэтому после перехода по пункту
   * курсор остаётся над меню и оно продолжает висеть. Прячем до тех пор, пока
   * указатель не уйдёт с выпадашки.
   */
  isDropdownSuppressed = false;

  private readonly router = inject(Router);

  constructor() {
    // от класса зависит --dev-banner-h, а на ней держатся все отступы под шапку
    document.documentElement.classList.toggle('has-dev-banner', SHOW_DEV_BANNER);
  }

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
