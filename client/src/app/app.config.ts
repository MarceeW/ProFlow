import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { errorInterceptor } from './_interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors(
        [
          jwtInterceptor,
          errorInterceptor
        ])),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ]
};
