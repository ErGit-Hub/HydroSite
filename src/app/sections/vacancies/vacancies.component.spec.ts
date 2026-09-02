import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { VacanciesComponent  } from './vacancies.component';

describe('VacanciesComponent', () => {
  let component: VacanciesComponent;
  let fixture: ComponentFixture<VacanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacanciesComponent],
      providers: [provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
