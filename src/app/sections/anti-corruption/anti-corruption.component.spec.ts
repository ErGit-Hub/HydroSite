import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntiCorruptionComponent } from './anti-corruption.component';

describe('AntiCorruptionComponent', () => {
  let component: AntiCorruptionComponent;
  let fixture: ComponentFixture<AntiCorruptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntiCorruptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntiCorruptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
