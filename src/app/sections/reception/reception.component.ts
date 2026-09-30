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

  /** Имя, должность и график берутся из i18n по key; время — как есть. */
  schedule = [
    { key: 'bekniyaz', time: '10:00 – 12:00' },
    { key: 'ibraev', time: '15:00 – 17:00' },
    { key: 'vakasova', time: '15:00 – 17:00' }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
