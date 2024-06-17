import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseSignalRService } from './base-signalr.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSignalRService extends BaseSignalRService {
  notificationReceivedEvent = new EventEmitter();

  constructor(
    http: HttpClient,
    router: Router) {
    super(http, router, 'notification');
  }

  protected override registerSignalRMethods(): void {
    this.hubConnection?.on('ReceiveNotification',
      () => this.notificationReceivedEvent.emit());
  }
}
