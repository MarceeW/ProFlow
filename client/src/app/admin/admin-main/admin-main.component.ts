import { Component, Input, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { InvitationsComponent } from '../invitations/invitations.component';
import { AccountsComponent } from '../accounts/accounts.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    MatTabsModule,
    InvitationsComponent,
    AccountsComponent,
  ],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss'
})
export class AdminMainComponent {

  @Input()
  activeTabIndex: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) { }

  onTabChange(tabId: number) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { activeTabIndex: tabId },
        queryParamsHandling: 'merge'
      }
    );
  }
}
