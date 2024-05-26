import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {

  getUsers() {
    return this.http.get<User[]>(this.apiUrl + 'user');
  }
}
