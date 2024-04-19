import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Invitation } from '../_models/invitation';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  generateInvitation(date: Date) {
    return this.http.get<Invitation>(
      this.apiUrl + "account/generate-invitation-key",
      { params: new HttpParams().set("expirationDate", date.toISOString()) }
    );
  }

  getInvitations() {
    return this.http.get<Invitation[]>(this.apiUrl + "account/invitations");
  }

  deleteInvitation(key: string) {
    return this.http.delete<string>(this.apiUrl + "account/delete-invitation/" + key);
  }

  readInvitation(key: string | null) {
    return this.http.get<Invitation>(this.apiUrl + "account/invitation/" + key);
  }
}
