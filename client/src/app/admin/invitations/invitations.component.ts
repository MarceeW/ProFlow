import { Component } from '@angular/core';

import { GenerateInvitationComponent } from './generate-invitation/generate-invitation.component';
import { MatDividerModule } from '@angular/material/divider';
import { ListInvitationComponent } from './list-invitation/list-invitation.component';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [
    GenerateInvitationComponent,
    ListInvitationComponent,
    MatDividerModule
  ],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss'
})
export class InvitationsComponent {
}
