import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserNotification } from '../_models/user-notification.model';
import { AccountService } from './account.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {

  constructor(
    http: HttpClient,
    router: Router,
    private accountService: AccountService) {
    super(http, router);
  }

  getNotifications() {
    const currentUser = this.accountService.getCurrentAuthUser();

    if (!currentUser)
      return;

    return this.http.get<UserNotification[]>(this.apiUrl + 'notification/' + currentUser.userName);
  }

  setNotificationsViewed() {
    const currentUser = this.accountService.getCurrentAuthUser();

    if (!currentUser)
      return;

    return this.http.get(this.apiUrl + 'notification/view/' + currentUser.userName);
  }

  getUnseenNotificationCount() {
    const currentUser = this.accountService.getCurrentAuthUser();

    if (!currentUser)
      return;

    return this.http.get<number>(this.apiUrl + 'notification/get-count/' + currentUser.userName);
  }
}
