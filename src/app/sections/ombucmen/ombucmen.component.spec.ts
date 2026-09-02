import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { OmbucmenComponent } from './ombucmen.component';

describe('OmbucmenComponent', () => {
  let component: OmbucmenComponent;
  let fixture: ComponentFixture<OmbucmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OmbucmenComponent],
      providers: [provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OmbucmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
