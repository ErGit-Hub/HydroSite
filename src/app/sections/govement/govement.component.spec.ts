import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovementComponent } from './govement.component';

describe('GovementComponent', () => {
  let component: GovementComponent;
  let fixture: ComponentFixture<GovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovementComponent]
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
