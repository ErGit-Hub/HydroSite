import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection, inject } from '@angular/core';
import {
  PreloadAllModules,
  TitleStrategy,
  provideRouter,
  withInMemoryScrolling,
  withNavigationErrorHandler,
  withPreloading
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { provideTranslateService, provideTranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from './core/translate.loader';
import { handleNavigationError } from './core/chunk-load-error';
import { LanguageService } from './core/language.service';
import { PageTitleStrategy } from './core/page-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      // Чанки разделов подтягиваются в фоне после старта, а не по клику в меню.
      withPreloading(PreloadAllModules),
      withNavigationErrorHandler(handleNavigationError)
    ),

    { provide: TitleStrategy, useClass: PageTitleStrategy },

    provideHttpClient(),

    provideTranslateService({
      defaultLanguage: 'ru',
      loader: provideTranslateLoader(CustomTranslateLoader)
    }),

    provideAppInitializer(() => inject(LanguageService).init())
  ]
};
