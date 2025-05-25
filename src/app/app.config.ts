import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';
import { provideEventPlugins } from "@taiga-ui/event-plugins";

import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
      provideAnimations(),
      provideZoneChangeDetection({ eventCoalescing: true }), 
      provideRouter(routes), 
      provideClientHydration(withEventReplay()),
      provideHttpClient(),
      provideEventPlugins(),
      provideTanStackQuery(new QueryClient()), provideHttpClient(), 
      provideTransloco({
        config: { 
          availableLangs: ['en', 'es', 'vi'],
          defaultLang: 'vi',
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }),
    ]
};
