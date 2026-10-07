import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-reception',
    imports: [TranslateModule],
    templateUrl: './reception.component.html',
    styleUrl: './reception.component.scss'
})
export class ReceptionComponent implements OnInit {
  isVisible = false;

  /** Имя, должность, график и время берутся из i18n (RECEPTION.PEOPLE.key). */
  schedule = [
    { key: 'bekniyaz' },
    { key: 'ibraev' },
    { key: 'mukhamediyev' },
    { key: 'vakasova' },
    { key: 'tazhenova' }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
