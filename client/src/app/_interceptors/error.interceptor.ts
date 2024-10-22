import { AccountService } from './../_services/account.service';
import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { ComponentArgsService } from '../_services/component-args.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const accountService = inject(AccountService);
  const argsService = inject(ComponentArgsService);
  return next(req).pipe(
    catchError(error => {
      if (error) {
        argsService.loading.set(false);

        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modelStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateErrors.push(error.error.errors[key])
                }
              }
              const errorMessage = modelStateErrors.flat();
              throw errorMessage;
            } else {
              const errorMessage = error.error[0]["description"] ? error.error[0]["description"] : error.error;
              toastr.error(errorMessage);
              break;
            }
          case 401:
            accountService.logout();
            toastr.info('Your token expired, now you are logged out', error.status.toString());
            break;
          case 403:
            toastr.warning('You are not allowed to do that');
            break;
          case 404:
            router.navigateByUrl('');
            toastr.error('404 - Not found');
            break;
          default:
            toastr.error('500 - Server error');
            break;
        }
      }
      throw error;
    })
  );
};
