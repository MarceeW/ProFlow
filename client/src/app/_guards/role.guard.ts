import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoleType } from '../_enums/role-type.enum';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const role = route.data['role'] as RoleType;
  const result = accountService.isCurrentUserInRole(role, RoleType.Administrator);

  if(!result)
    toastr.warning("You can't do that");

  return result;
};
