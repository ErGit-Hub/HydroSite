import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ReceptionComponent  } from './reception.component';

describe('ReceptionComponent', () => {
  let component: ReceptionComponent;
  let fixture: ComponentFixture<ReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionComponent],
      providers: [provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
