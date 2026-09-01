import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { GovementComponent } from './govement.component';

describe('GovementComponent', () => {
  let component: GovementComponent;
  let fixture: ComponentFixture<GovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovementComponent],
      providers: [provideTranslateService(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
