import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const accountService = inject(AccountService);

  // TODO: check if user's token still valid, if it is not, then log out
  if (accountService.getCurrentAuthUser()) {
    toastr.info('You are already logged in!');
    return false;
  }
  return true;
};
