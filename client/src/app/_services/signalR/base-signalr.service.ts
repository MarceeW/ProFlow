import { Inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthUser } from '../../_models/auth-user';
import { BaseService } from '../base.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseSignalRService extends BaseService {
  protected hubUrl = environment.hubUrl;
  protected hubConnection?: HubConnection;

  constructor(
    http: HttpClient,
    router: Router,
    @Inject(String) protected hubName: string) {
    super(http, router);
  }

  createHubConnection(user: AuthUser) {
    if(!user)
      return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + this.hubName, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.registerSignalRMethods();

    this.hubConnection.start().catch(error => console.error(error));
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.error(error));
  }

  protected registerSignalRMethods() {}
}
