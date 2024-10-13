import { AccountService } from './../_services/account.service';
import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const accountService = inject(AccountService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
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
            toastr.error('Unauthorized', error.status.toString());
            accountService.logout();
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            toastr.error('Something unexpected went wrong!');
            console.log(error);
            break;
        }
      }
      throw error;
    })
  );
};
