import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { LangSwitcherComponent } from './lang-switcher.component';

describe('LangSwitcherComponent', () => {
  let component: LangSwitcherComponent;
  let fixture: ComponentFixture<LangSwitcherComponent>;

  const options = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.lang-option')) as HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangSwitcherComponent],
      providers: [provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('список закрыт, пока по кнопке не кликнули', () => {
    expect(options().length).toBe(0);

    fixture.nativeElement.querySelector('.lang-trigger').click();
    fixture.detectChanges();

    expect(options().length).toBe(3);
  });

  it('выбор языка закрывает список и меняет lang у документа', () => {
    component.toggle();
    fixture.detectChanges();

    component.select('en');
    fixture.detectChanges();

    expect(component.isOpen).toBe(false);
    expect(component.current).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  // Бьём по document, а не по методу: так проверяется и сама привязка
  // @HostListener, из-за которой Escape уже один раз не сработал в браузере.
  it('Escape закрывает список', () => {
    component.toggle();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(options().length).toBe(0);
  });

  it('клик мимо компонента закрывает список', () => {
    component.toggle();
    fixture.detectChanges();

    document.body.click();
    fixture.detectChanges();

    expect(options().length).toBe(0);
  });
});
