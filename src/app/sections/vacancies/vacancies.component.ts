import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-vacancies',
    imports: [TranslateModule],
    templateUrl: './vacancies.component.html',
    styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent  {
isVisible = false;
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
copyEmail() {
  navigator.clipboard.writeText('info@yourcompany.kz');
  alert('Email скопирован');
}
}
