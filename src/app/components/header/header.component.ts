import { Component, HostListener, inject } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

import { LanguageService } from '../../core/language.service';

@Component({
    selector: 'app-header',
    imports: [TranslateModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isMenuOpen = false;
  isScrolled = false;

  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setLang(lang: string) {
    this.language.use(lang);
    this.isMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
