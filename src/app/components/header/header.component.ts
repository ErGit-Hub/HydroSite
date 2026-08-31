import { Component, HostListener } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [TranslateModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isMenuOpen = false;
  isScrolled = false;

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use('ru');
  }

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setLang(lang: string) {
    this.translate.use(lang);
    this.isMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}