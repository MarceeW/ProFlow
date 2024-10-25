import { Injectable } from '@angular/core';
import { User } from '../_models/user.model';
import { BaseService } from './base.service';
import { RoleType } from '../_enums/role-type.enum';
import { UserSkill } from '../_models/user-skill.model';
import { UserStat } from '../_models/user-stat.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  getUser(id: string) {
    return this.http.get<User>(this.apiUrl + 'user/' + id);
  }

  getUsers(roles?: RoleType[]) {
    return this.http.get<User[]>(this.apiUrl + 'user',
    {
      params: {
        roles: roles?.join(',') ?? ''
      }
    });
  }

  getUserSkills(userId: string) {
    return this.http.get<UserSkill[]>(this.apiUrl + 'user/skills/' + userId);
  }

  getUserStats(userId: string) {
    return this.http.get<UserStat>(this.apiUrl + 'user/stats/' + userId);
  }

  setUserSkill(userSkill: UserSkill) {
    return this.http.patch(this.apiUrl + 'user/set-skill/', userSkill);
  }
}
