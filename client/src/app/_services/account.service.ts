import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, take } from 'rxjs';
import { AuthUser } from '../_models/auth-user';
import { LoginModel } from '../_models/login-model';
import { RegisterModel } from '../_models/register-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  apiUrl: string = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
      private http: HttpClient,
      private router: Router) { }

  login(user: LoginModel) {
    return this.http.post<AuthUser>(
      this.apiUrl + 'account/login',
      user
    )
      .pipe(
        map((response: AuthUser) => {
          const user = response;
          if (user) {
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  register(registerModel: RegisterModel, invitationKey: string | null) {
    return this.http.post<AuthUser>(
      this.apiUrl + 'account/register',
      registerModel,
      { params: new HttpParams().set("invitationKey", invitationKey == null ? '' : invitationKey) }
    )
      .pipe(
        map((response: AuthUser) => {
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
    this.router.navigateByUrl('/login');
  }

  setCurrentUser(user: AuthUser) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  getCurrentUser(): AuthUser | null {
    const userString = localStorage.getItem('user');
    if (!userString)
      return null;

    const user: AuthUser = JSON.parse(userString);
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
          if (user && user.roles.includes("Administrator"))
            isAdmin = true;
        }
      });
    return isAdmin;
  }
}
