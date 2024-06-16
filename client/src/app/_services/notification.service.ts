import { AccountService } from './account.service';
import { Injectable, inject } from '@angular/core';
import { BaseService } from './base.service';
import { UserNotification } from '../_models/user-notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {
  private accountService: AccountService = inject(AccountService);

  getNotifications() {
    const currentUser = this.accountService.getCurrentUser();

    if (!currentUser)
      return;

    return this.http.get<UserNotification[]>(this.apiUrl + 'notification/' + currentUser.userName);
  }

  setNotificationsViewed() {
    const currentUser = this.accountService.getCurrentUser();

    if (!currentUser)
      return;

    return this.http.get(this.apiUrl + 'notification/view/' + currentUser.userName);
  }

  getUnseenNotificationCount() {
    const currentUser = this.accountService.getCurrentUser();

    if (!currentUser)
      return;

    return this.http.get<number>(this.apiUrl + 'notification/get-count/' + currentUser.userName);
  }
}
