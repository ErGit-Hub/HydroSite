
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-structure',
    imports: [TranslateModule],
    templateUrl: './structure.component.html',
    styleUrl: './structure.component.scss'
})
export class StructureComponent {
isVisible = false;
selectedLeader: any = null;
selectedKey: string | null = null;

/** Порядок карточек; имя/должность/описание лежат в i18n под LEADERS.<key>.*. */
leaderKeys = ['bekniyaz', 'ibraev', 'vakasova'];

leaders: any = {
  bekniyaz: { image: 'assets/images/leader/leader1.jpeg' },
  ibraev: { image: 'assets/images/leader/leader2.png' },
  vakasova: { image: 'assets/images/leader/leader6.png' }
};

selectLeader(key: string) {
  this.selectedKey = key;
  this.selectedLeader = this.leaders[key];
}
ngAfterViewInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}

}
