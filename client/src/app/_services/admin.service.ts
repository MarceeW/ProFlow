import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { UserManageModel } from '../_models/user-manage-model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Role } from '../_models/role';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  updateUser(user: UserManageModel) {
    return this.http
      .patch<User>(this.apiUrl + 'admin/update', user);
  }

  getUsers() {
    return this.http.get<User[]>(this.apiUrl + 'admin/');
  }

  getFilteredUsers(filter: string) {
    return this.http.get<User[]>(this.apiUrl + 'admin/' + filter);
  }

  getRoles() {
    return this.http.get<Role[]>(this.apiUrl + 'admin/roles');
  }
}
