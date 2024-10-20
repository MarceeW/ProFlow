import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private accountService: AccountService = inject(AccountService);

  getUsers(query?: string | null) {
    return this.http.get<User[]>(this.apiUrl + 'user/' + (query ? query : ''));
  }
}
