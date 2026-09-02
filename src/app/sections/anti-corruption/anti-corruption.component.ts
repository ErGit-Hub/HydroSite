import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-anti-corruption',
    imports: [TranslateModule],
    templateUrl: './anti-corruption.component.html',
    styleUrl: './anti-corruption.component.scss'
})
export class AntiCorruptionComponent implements OnInit {
  isVisible = false;

  /** Названия и описания лежат в i18n под ANTI_CORRUPTION.DOCS.<key>. */
  documents = [
    { key: 'ETHICS', file: 'assets/docs/Кодекс корпоративной этики.pdf' },
    { key: 'INSTRUCTION', file: 'assets/docs/Инструкция_по_противодействию_коррупции_для_работников.pdf' },
    { key: 'POLICY', file: 'assets/docs/ВНУТРЕННЯЯ_ПОЛИТИКА_ПРОТИВОДЕЙСТВИЯ_КОРРУПЦИИ.pdf' },
    { key: 'CONFLICT', file: 'assets/docs/ВНУТРЕННЯЯ_ПОЛИТИКА_ВЫЯВЛЕНИЯ_И_УРЕГУЛИРОВАНИЯ_КОНФЛИКТА_ИНТЕРЕСОВ.pdf' },
    { key: 'PLAN', file: 'assets/docs/ВНУТРЕННИЙ_ПЛАН_МЕРОПРИЯТИЙ_ПО_ВОПРОСАМ_ПРОТИВОДЕЙСТВИЯ_КОРРУПЦИИ.pdf' },
    { key: 'STANDARD', file: 'assets/docs/Антикоррупционный стандарт.pdf' }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 50);
  }
}
