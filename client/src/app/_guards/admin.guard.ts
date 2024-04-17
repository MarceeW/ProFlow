import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../_services/account.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  const isCurrentUserAdmin = accountService.isCurrentUserAdmin();

  if (!isCurrentUserAdmin)
    toastr.error('You are not an administrator!');

  return isCurrentUserAdmin;
};
