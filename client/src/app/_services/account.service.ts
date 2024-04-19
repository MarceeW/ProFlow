import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, take } from 'rxjs';
import { User } from '../_models/user';
import { LoginModel } from '../_models/loginModel';
import { RegisterModel } from '../_models/registerModel';
import { Roles } from '../_enums/roles.enum';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  apiUrl: string = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute) { }

  login(user: LoginModel) {
    return this.http.post<User>(
      this.apiUrl + 'account/login',
      user
    )
      .pipe(
        map((response: User) => {
          const user = response;
          if (user) {
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  register(registerModel: RegisterModel, invitationKey: string | null) {
    return this.http.post<User>(
      this.apiUrl + 'account/register',
      registerModel,
      { params: new HttpParams().set("invitationKey", invitationKey == null ? '' : invitationKey) }
    )
      .pipe(
        map((response: User) => {
          const user = response;
          if (user) {
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getCurrentUser(): User | null {
    const userString = localStorage.getItem('user');
    if (!userString)
      return null;

    const user: User = JSON.parse(userString);
    return user;
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  isCurrentUserAdmin() {
    let isAdmin: boolean = false;

    this.currentUser$.pipe(take(1))
      .subscribe({
        next: user => {
          if (user && user.roles.includes(Roles.Administrator))
            isAdmin = true;
        }
      });
    return isAdmin;
  }
}
