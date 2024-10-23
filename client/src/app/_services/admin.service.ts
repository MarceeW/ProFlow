import { Injectable } from '@angular/core';
import { Account } from '../_models/account';
import { UserManageModel } from '../_models/user-manage-model';
import { Role } from '../_models/role';
import { BaseService } from './base.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  updateAccount(manageModel: UserManageModel) {
    return this.http
      .patch<Account>(this.apiUrl + 'admin/update-account', manageModel);
  }

  getAccounts() {
    return this.http.get<Account[]>(this.apiUrl + 'admin/accounts/');
  }

  deleteAccount(id: string, deputy?: User) {
    return this.http.patch(this.apiUrl + 'admin/delete-account/' + id, deputy, {responseType: 'text'});
  }

  getFilteredAccounts(filter: string) {
    return this.http.get<Account[]>(this.apiUrl + 'admin/accounts/' + filter);
  }

  getRoles() {
    return this.http.get<Role[]>(this.apiUrl + 'admin/roles');
  }
}
