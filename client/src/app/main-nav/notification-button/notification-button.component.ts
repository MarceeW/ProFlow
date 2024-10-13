import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../_component-base/base.component';
import { UserNotification } from '../../_models/user-notification';
import { NotificationService } from '../../_services/notification.service';
import { NotificationSignalRService } from '../../_services/signalR/notification-signalr.service';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';


@Component({
  selector: 'app-notification-button',
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
    DatePipe,
    OverlayModule
  ],
  templateUrl: './notification-button.component.html',
  styleUrl: './notification-button.component.scss'
})
export class NotificationButtonComponent extends BaseComponent implements OnInit {
  readonly notifications = signal<UserNotification[]>([]);
  readonly unseenNotificationCount = signal(0);
  readonly notificationsOpen = signal(false);

  private readonly _notificationService = inject(NotificationService);
  private readonly _notificationHubService = inject(NotificationSignalRService);
  private readonly _overlay = inject(Overlay);

  ngOnInit(): void {
    this._notificationHubService.notificationReceivedEvent
      .subscribe(() => this.getUnseenNotificationCount());
  }

  onNotificationButtonClicked() {
    this.loadNotifications();
    this.setNotificationsViewed();
  }

  setNotificationsViewed() {
    this._notificationService.setNotificationsViewed()
      ?.pipe(takeUntil(this._destroy$)).subscribe();
  }

  loadNotifications() {
    this._notificationService.getNotifications()
      ?.pipe(takeUntil(this._destroy$))
      .subscribe(notifications => {
        this.notifications.set(notifications);
      });
  }

  toggleNotifications() {
    this.notificationsOpen.set(!this.notificationsOpen());
  }

  private getUnseenNotificationCount() {
    this._notificationService.getUnseenNotificationCount()
      ?.pipe(takeUntil(this._destroy$))
        .subscribe(count => {
          this.unseenNotificationCount.set(count);
        });
  }
}
