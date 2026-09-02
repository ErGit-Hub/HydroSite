import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { StructureComponent } from './structure.component';

describe('StructureComponent', () => {
  let component: StructureComponent;
  let fixture: ComponentFixture<StructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureComponent],
      providers: [provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
