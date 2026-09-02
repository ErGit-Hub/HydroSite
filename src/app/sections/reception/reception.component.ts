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

  /** Должность и график берутся из i18n по key; имя и время — как есть. */
  schedule = [
    { key: 'bekniyaz', name: 'Бекнияз Болат Қабыкенұлы', time: '10:00 – 12:00' },
    { key: 'ibraev', name: 'Ибраев Даир Зарапович', time: '15:30 – 17:30' },
    { key: 'mykan', name: 'Мықан Қаракөз Еламанқызы', time: '15:30 – 17:30' },
    { key: 'vakasova', name: 'Вакасова Гульданам Туглукжановна', time: '15:30 – 17:30' }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
