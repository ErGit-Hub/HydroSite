import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { NewsDetailsComponent  } from './news-details.component';

describe('NewsDetailsComponent', () => {
  let component: NewsDetailsComponent;
  let fixture: ComponentFixture<NewsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDetailsComponent],
      // без параметра `:id` компонент считает новость ненайденной и уходит на /404
      providers: [provideTranslateService(), provideRouter([{ path: '404', children: [] }])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('уводит на 404, если новости с таким id нет', async () => {
    await fixture.whenStable();

    expect(component.newsItem).toBeUndefined();
    expect(TestBed.inject(Router).url).toBe('/404');
  });
});
