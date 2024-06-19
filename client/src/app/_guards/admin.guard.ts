import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AccountService } from '../_services/account.service';
import { RoleType } from '../_enums/role-type.enum';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  return accountService.isCurrentUserInRole(RoleType.Administrator);
};
