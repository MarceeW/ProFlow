import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { BaseService } from './base.service';
import { RoleType } from '../_enums/role-type.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  getUsers(roles: RoleType[]) {
    return this.http.get<User[]>(this.apiUrl + 'user',
    {
      params: {
        roles: roles.join(',')
      }
    });
  }
}
