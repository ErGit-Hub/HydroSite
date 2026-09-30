import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AfterViewInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

declare const gtag: (...args: any[]) => void;

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

constructor(private router: Router) {
  /** SPA: без этого GA4 видит только самый первый заход, переходы между разделами не считаются. */
  this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd)
  ).subscribe((event) => {
    if (typeof gtag === 'function') {
      gtag('config', 'G-CB5EZW2608', { page_path: event.urlAfterRedirects });
    }
  });
}

ngAfterViewInit() {
  setTimeout(() => {

    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, {
      threshold: 0.2
    });

    elements.forEach(el => observer.observe(el));

  }, 100);
}

}
