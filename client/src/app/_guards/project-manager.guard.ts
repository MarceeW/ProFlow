import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { RoleType } from '../_enums/role-type.enum';
import { take } from 'rxjs';

export const projectManagerGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  const res = accountService.isCurrentUserInRole(RoleType.ProjectManager);
  res.pipe(take(1)).subscribe({next: res => {
    if(!res)
      toastr.error("You are not a project manager!");
  }})
  return res;
};
