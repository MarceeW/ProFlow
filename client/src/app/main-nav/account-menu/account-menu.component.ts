import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AccountService } from '../../_services/account.service';
import { RouterModule } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss'
})
export class AccountMenuComponent {
  constructor(
    public accountService: AccountService) {}
}
