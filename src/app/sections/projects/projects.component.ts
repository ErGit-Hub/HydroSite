import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-projects',
    imports: [TranslateModule],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  isVisible = false;

  /** Тексты карточек лежат в i18n под PROJECTS.ITEMS.<key>. */
  projects = [
    { key: 'SOUTH_MONITORING', period: '2024–2026', status: 'ACTIVE', progress: 75, image: 'assets/images/projects/project1.png' },
    { key: 'ALMATY_RESERVES', period: '2025–2027', status: 'ACTIVE', progress: 45, image: 'assets/images/projects/project2.png' },
    { key: 'LAB', period: '2025–2026', status: 'ACTIVE', progress: 60, image: 'assets/images/projects/project3.png' },
    { key: 'MAP', period: '2020–2023', status: 'DONE', progress: 100, image: 'assets/images/projects/project4.png' },
    { key: 'PROTECTION', period: '2022–2024', status: 'DONE', progress: 100, image: 'assets/images/projects/project5.png' },
    { key: 'AQUIFERS', period: '2027–2029', status: 'PLANNED', progress: 0, image: 'assets/images/projects/project6.png' }
  ];

  safeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://hydro.krpro.kz/'
    );
  }

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
