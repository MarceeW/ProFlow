import { Injectable } from '@angular/core';
import { Account } from '../_models/account';
import { UserManageModel } from '../_models/user-manage-model';
import { Role } from '../_models/role';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  updateUser(manageModel: UserManageModel) {
    return this.http
      .patch<Account>(this.apiUrl + 'admin/update-account', manageModel);
  }

  getUsers() {
    return this.http.get<Account[]>(this.apiUrl + 'admin/accounts/');
  }

  getFilteredUsers(filter: string) {
    return this.http.get<Account[]>(this.apiUrl + 'admin/accounts/' + filter);
  }

  getRoles() {
    return this.http.get<Role[]>(this.apiUrl + 'admin/roles');
  }
}
