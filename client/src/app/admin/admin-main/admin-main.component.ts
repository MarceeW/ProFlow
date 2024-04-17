import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { InvitationsComponent } from '../invitations/invitations.component';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    MatTabsModule,
    InvitationsComponent
  ],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent {

}
