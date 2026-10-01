
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-leadership',
    imports: [TranslateModule],
    templateUrl: './leadership.component.html',
    styleUrl: './leadership.component.scss'
})
export class LeadershipComponent {
isVisible = false;
selectedLeader: any = null;
selectedKey: string | null = null;

/** Порядок карточек; имя/должность/описание лежат в i18n под LEADERS.<key>.*. */
leaderKeys = ['bekniyaz', 'ibraev', 'vakasova', 'tazhenova'];

leaders: any = {
  bekniyaz: { image: 'assets/images/leader/leader1.jpeg' },
  ibraev: { image: 'assets/images/leader/leader2.png' },
  vakasova: { image: 'assets/images/leader/leader6.png' },
  tazhenova: { image: 'assets/images/leader/tazhenova.jpeg', position: 'center 25%' }
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
