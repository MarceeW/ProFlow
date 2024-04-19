import { InvitationLinkPipe } from './../../../_pipes/invitation-link.pipe';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { InvitationService } from '../../../_services/invitation.service';
import { Invitation } from '../../../_models/invitation';
import { CommonModule, DatePipe } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { DateExpiredPipe } from '../../../_pipes/date-expired.pipe';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTableModule,
    DatePipe,
    DateExpiredPipe,
    InvitationLinkPipe,
    MatIconModule,
    ClipboardModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ["key", "expires", "isActivated", "actions"];
  invitations: Invitation[] = [];

  constructor(private invitationService: InvitationService) { }

  ngOnInit(): void {
    this.getInvitations();
  }

  getInvitations() {
    this.invitationService.getInvitations().pipe().subscribe({
      next: invitations => console.log(this.invitations = invitations)
    });
  }

  delete(key: string) {
    this.invitationService.deleteInvitation(key).pipe().subscribe({
      next: _ => this.getInvitations()
    });
  }
}
