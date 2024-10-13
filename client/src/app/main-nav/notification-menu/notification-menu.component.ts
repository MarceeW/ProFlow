import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../_services/notification.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, ReplaySubject, of, take, takeUntil } from 'rxjs';
import { UserNotification } from '../../_models/user-notification';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationSignalRService } from '../../_services/signalR/notification-signalr.service';
import { Subject } from '@microsoft/signalr';


@Component({
  selector: 'app-notification-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './notification-menu.component.html',
  styleUrl: './notification-menu.component.scss'
})
export class NotificationMenuComponent implements OnInit, OnDestroy {
  // TODO: Fix component template

  private notificationSource = new BehaviorSubject<UserNotification[]>([]);
  notifications$ = this.notificationSource.asObservable();

  private unseenNotificationCountSource = new BehaviorSubject<number>(0);
  unseenNotificationCount$ = this.unseenNotificationCountSource.asObservable();

  notificationsLoaded = false;
  notificationsViewed = false;

  private ngDestroy$ = new ReplaySubject<boolean>(1);

  constructor(
    private notificationService: NotificationService,
    private notificationHubService: NotificationSignalRService) {}

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  ngOnInit(): void {
    this.notificationHubService.notificationReceivedEvent
      .subscribe(() => this.getUnseenNotificationCount());
  }

  onNotificationButtonClicked() {
    this.notificationService.getNotifications()
      ?.pipe(takeUntil(this.ngDestroy$))
      .subscribe({
        next: notifications => {
          this.notificationSource.next(notifications);
          this.notificationsLoaded = true;
        }
      });

    this.notificationService.setNotificationsViewed()
      ?.pipe(takeUntil(this.ngDestroy$)).subscribe();

    this.notificationsViewed = true;
  }

  private getUnseenNotificationCount() {
    console.info("New notification received!");
    this.notificationService.getUnseenNotificationCount()
      ?.pipe(takeUntil(this.ngDestroy$))
        .subscribe({
          next: count => {
            this.unseenNotificationCountSource.next(count);
            if(count > 0)
              this.notificationsViewed = false;
          }
        });
  }
}
