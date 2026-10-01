
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

ngAfterViewInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}

}
