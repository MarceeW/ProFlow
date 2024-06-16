import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthUser } from '../_models/auth-user';

@Injectable({
  providedIn: 'root'
})
export class BaseHubService {
  hubUrl = environment.hubUrl;
  protected hubConnection?: HubConnection;

  constructor() { }

  createHubConnection(user: AuthUser, hubName: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + hubName, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error => console.error(error));
  }
}
