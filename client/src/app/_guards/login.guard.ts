import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const toastr = inject(ToastrService);
  const accountService = inject(AccountService);

  // TODO: check if user's token still valid, if it is not, then log out
  if (accountService.getCurrentUser()) {
    toastr.info('You are already logged in!');
    return false;
  }
  return true;
};
