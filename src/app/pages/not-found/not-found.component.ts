import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-not-found',
    imports: [TranslateModule, RouterModule],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private readonly meta = inject(Meta);

  /**
   * Сервер отдаёт SPA-fallback со статусом 200, поэтому единственный способ
   * не пустить опечатки в индекс — noindex на самой странице.
   */
  ngOnInit(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

  ngOnDestroy(): void {
    this.meta.removeTag("name='robots'");
  }
}
