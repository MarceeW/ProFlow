import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private accountService: AccountService = inject(AccountService);

  getUsers(filter?: string | null) {
    return this.http.get<User[]>(this.apiUrl + 'user/' + (filter ? filter : ''));
  }

  getCurrentUser() {
    const currentUser = this.accountService.getCurrentUser();

    if(!currentUser)
      return;

    return this.http.get<User>(this.apiUrl + 'user/' + 'by-username', {
      params: new HttpParams().set('userName', currentUser.userName)});
  }
}
