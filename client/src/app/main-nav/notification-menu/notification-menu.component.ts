import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from '../../_services/notification.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, of, take } from 'rxjs';
import { UserNotification } from '../../_models/user-notification';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
export class NotificationMenuComponent implements OnInit{
  private notificationSource = new BehaviorSubject<UserNotification[]>([]);
  notifications$ = this.notificationSource.asObservable();
  unseenNotificationCount$ = new Observable<number>();
  notificationsLoaded = false;
  notificationsViewed = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.getUnseenNotificationCount();
  }

  onNotificationButtonClicked() {
    this.notificationService.getNotifications()?.pipe(take(1))
      .subscribe({
        next: notifications => {
          this.notificationSource.next(notifications);
          this.notificationsLoaded = true;
        }
      });
    this.notificationService.setNotificationsViewed()?.pipe(take(1)).subscribe();
    this.notificationsViewed = true;
  }

  private getUnseenNotificationCount() {
    this.notificationService.getUnseenNotificationCount()?.pipe(take(1))
      .subscribe({
        next: count => this.unseenNotificationCount$ = of(count)
      });
  }
}
