import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/core';

import { CustomTranslateLoader } from './translate.loader';

describe('CustomTranslateLoader', () => {
  function setup(scriptSrc: string | null) {
    const doc = {
      querySelector: () => (scriptSrc === null ? null : { src: scriptSrc })
    } as unknown as Document;

    TestBed.configureTestingModule({
      providers: [
        CustomTranslateLoader,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DOCUMENT, useValue: doc }
      ]
    });

    return {
      loader: TestBed.inject(CustomTranslateLoader),
      http: TestBed.inject(HttpTestingController)
    };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('добавляет версию сборки к адресу перевода', () => {
    const { loader, http } = setup('https://site.kz/main-XID455OU.js');

    loader.getTranslation('ru').subscribe();

    http.expectOne('./assets/i18n/ru.json?v=XID455OU').flush({});
    http.verify();
  });

  it('без хэша в имени бандла обходится без версии', () => {
    const { loader, http } = setup('http://localhost:4200/main.js');

    loader.getTranslation('kz').subscribe();

    http.expectOne('./assets/i18n/kz.json').flush({});
    http.verify();
  });
});
