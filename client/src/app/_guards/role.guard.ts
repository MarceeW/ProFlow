import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs';
import { RoleType } from '../_enums/role-type.enum';
import { AccountService } from '../_services/account.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const role = route.data['role'] as RoleType;
  const isUserInRole = accountService.isCurrentUserInRole(role);

  return isUserInRole.pipe(map(
    u => {
      if(!u)
        toastr.warning("You don't have permission to view that!");
      return u;
    }
  ));
};
