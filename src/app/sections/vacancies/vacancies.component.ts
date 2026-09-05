import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-vacancies',
    imports: [TranslateModule],
    templateUrl: './vacancies.component.html',
    styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent  {
private readonly translate = inject(TranslateService);
isVisible = false;
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
copyEmail() {
  navigator.clipboard.writeText(this.translate.instant('CONTACTS.EMAIL'));
  alert('Email скопирован');
}
}
