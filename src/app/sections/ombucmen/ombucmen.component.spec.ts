import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmbucmenComponent } from './ombucmen.component';

describe('OmbucmenComponent', () => {
  let component: OmbucmenComponent;
  let fixture: ComponentFixture<OmbucmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OmbucmenComponent]
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
