import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoleType } from '../_enums/role-type.enum';
import { AccountService } from '../_services/account.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const role = route.data['role'] as RoleType;
  return accountService.isCurrentUserInRole(role);
};
