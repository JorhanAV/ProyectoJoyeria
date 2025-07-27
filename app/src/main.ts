/// <reference types="@angular/localize" />

import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
