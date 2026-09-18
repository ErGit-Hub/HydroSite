
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    imports: [TranslateModule, RouterModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    // шапка вместе с плашкой «в разработке», если она включена
    const yOffset = -(document.querySelector('header')?.offsetHeight ?? 80);
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}
}
