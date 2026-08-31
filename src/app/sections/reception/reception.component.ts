import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-reception',
    imports: [],
    templateUrl: './reception.component.html',
    styleUrl: './reception.component.scss'
})
export class ReceptionComponent  {
isVisible = false;
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
