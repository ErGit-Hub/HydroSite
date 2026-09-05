import { Component, ElementRef, HostListener, inject } from '@angular/core';

import { LANGUAGES, LanguageService } from '../../core/language.service';

/**
 * Выпадающий выбор языка (флаг вместо текста). Открывается по клику, а не по
 * :hover, как остальные меню в шапке: hover-меню недоступны с тач-экрана и с клавиатуры.
 */
@Component({
    selector: 'app-lang-switcher',
    imports: [],
    templateUrl: './lang-switcher.component.html',
    styleUrl: './lang-switcher.component.scss'
})
export class LangSwitcherComponent {
  readonly languages = LANGUAGES;

  isOpen = false;

  private readonly language = inject(LanguageService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  get current(): string {
    return this.language.current;
  }

  get currentLabel(): string {
    return this.language.currentLabel;
  }

  get currentFlag(): string {
    return this.languages.find(l => l.code === this.current)?.flag ?? '';
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focusOption(0);
    }
  }

  select(code: string): void {
    this.language.use(code);
    this.close(true);
  }

  close(returnFocus = false): void {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    if (returnFocus) {
      this.trigger()?.focus();
    }
  }

  /** Стрелки водят по списку, Esc закрывает и возвращает фокус на кнопку. */
  onListKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();

    const options = this.options();
    const from = options.indexOf(this.document().activeElement as HTMLElement);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    this.focusOption((from + step + options.length) % options.length, false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close(true);
  }

  private focusOption(index: number, defer = true): void {
    const focus = () => this.options()[index]?.focus();
    defer ? setTimeout(focus) : focus();
  }

  private options(): HTMLElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.lang-option'));
  }

  private trigger(): HTMLElement | null {
    return this.host.nativeElement.querySelector<HTMLElement>('.lang-trigger');
  }

  private document(): Document {
    return this.host.nativeElement.ownerDocument;
  }
}
