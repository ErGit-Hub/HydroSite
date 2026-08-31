import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { provideTranslateService, provideTranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from './core/translate.loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),

    provideHttpClient(),

    provideTranslateService({
      defaultLanguage: 'ru',
      loader: provideTranslateLoader(CustomTranslateLoader)
    })
  ]
};