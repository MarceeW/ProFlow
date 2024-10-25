import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { RoleType } from '../_enums/role-type.enum';
import { AccountSettingsModel } from '../_models/account-settings-model';
import { AuthUser } from '../_models/auth-user';
import { LoginModel } from '../_models/login-model';
import { RegisterModel } from '../_models/register-model';
import { BaseService } from './base.service';
import { NotificationSignalRService } from './signalR/notification-signalr.service';
import { User } from '../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService {
  private currentUserSource = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  private currentAccountPictureSource = new BehaviorSubject<string>('');
  currentAccountPicture$ = this.currentAccountPictureSource.asObservable();

  constructor(
    http: HttpClient,
    router: Router,
    private notificationHubService: NotificationSignalRService) {
      super(http, router);
  }

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
            this.loadCurrentUserProfilePicture();
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
            this.loadCurrentUserProfilePicture();
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/login');
    this.notificationHubService.stopHubConnection();
  }

  setCurrentUser(user: AuthUser) {
    const claims = this.getClaimsFromToken(user.token)

    user.id = claims.sub;
    user.fullName = claims.name;
    user.roles = [];

    const roles = claims.role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.notificationHubService.createHubConnection(user);
  }

  getCurrentAuthUser(): AuthUser | null {
    const userString = localStorage.getItem('user');
    if (!userString)
      return null;

    const user: AuthUser = JSON.parse(userString);
    return user;
  }

  getCurrentUser(): User | null {
    const user = this.getCurrentAuthUser();
    return user as unknown as User;
  }

  getClaimsFromToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  isCurrentUserInRole(...role: (RoleType | string)[]) {
    const user = this.getCurrentAuthUser();

    if(!user)
      return false;

    return user.roles.filter(_role => role.includes(_role)).length > 0;
  }

  uploadCurrentUserProfilePicture(image: File) {
    const formData = new FormData();
    formData.append('picture', image, image.name);
    return this.http.post(this.apiUrl + 'account/upload-picture', formData)
      .pipe(
        map(_ => this.loadCurrentUserProfilePicture())
      );
  }


  updateAccountSettings(settingsModel: AccountSettingsModel) {
    return this.http.patch<AuthUser>(this.apiUrl + 'account/update', settingsModel)
    .pipe(
      map(authUser => {
        this.setCurrentUser(authUser);
        return authUser;
      })
    );
  }

  loadCurrentUserProfilePicture() {
    const currentUser = this.getCurrentAuthUser();
    if(!currentUser)
      return;
    this.currentAccountPictureSource.next(this.getAccountProfilePictureSource(currentUser.id));
  }

  getAccountProfilePictureSource(accountId: string) {
    return `${this.apiUrl}user/picture/${accountId}?${new Date().getTime()}`;
  }
}
