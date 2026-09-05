import { Component } from '@angular/core';
import { HeroComponent } from "../../sections/hero/hero.component";
import { NewsPreviewComponent } from "../../sections/news-preview/news-preview.component";

@Component({
    selector: 'app-home',
    imports: [HeroComponent, NewsPreviewComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

}
