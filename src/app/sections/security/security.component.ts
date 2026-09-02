import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-security',
    imports: [TranslateModule],
    templateUrl: './security.component.html',
    styleUrl: './security.component.scss'
})
export class SecurityComponent {
  /** Названия лежат в i18n под SECURITY.DOCS.<key>, код документа — рядом с файлом. */
  documents = [
    {
      key: 'REGULATION',
      code: 'КГГ-СИБТБ-ПОЛ-002',
      file: 'assets/docs/КГГ-СИБТБ-ПОЛ-002 - Положение о Службе ИБТБ.pdf'
    },
    {
      key: 'LABOUR_POLICY',
      code: 'КГГ-СИБТБ-ПОЛ-001',
      file: 'assets/docs/Политика ОТ КГГ-СИБТБ-ПОЛ-001.pdf'
    }
  ];
}
