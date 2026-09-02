import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { SecurityComponent } from './security.component';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityComponent],
      providers: [provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('показывает оба документа со ссылками на файлы', () => {
    const links = fixture.nativeElement.querySelectorAll('.doc-item') as NodeListOf<HTMLAnchorElement>;

    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toContain('КГГ-СИБТБ-ПОЛ-002');
    expect(links[1].getAttribute('href')).toContain('КГГ-СИБТБ-ПОЛ-001');
  });
});
