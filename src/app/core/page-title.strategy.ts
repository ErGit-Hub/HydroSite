import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_NAME = 'HydroGeo';
const HOME_TITLE = 'HydroGeo — Гидрогеология Казахстана';

/** Подставляет `title` маршрута в <title>, добавляя название сайта. */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const page = this.buildTitle(snapshot);
    this.title.setTitle(page ? `${page} — ${SITE_NAME}` : HOME_TITLE);
  }
}
