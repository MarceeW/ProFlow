import { Component } from '@angular/core';

import { GenerateComponent } from './generate/generate.component';
import { MatDividerModule } from '@angular/material/divider';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [
    GenerateComponent,
    ListComponent,
    MatDividerModule
  ],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.css'
})
export class InvitationsComponent {
}
