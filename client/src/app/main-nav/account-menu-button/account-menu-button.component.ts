import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AccountService } from '../../_services/account.service';
import { RouterModule } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-account-menu-button',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './account-menu-button.component.html',
  styleUrl: './account-menu-button.component.scss'
})
export class AccountMenuButtonComponent {
  readonly accountService = inject(AccountService);

  get userId() {
    return this.accountService.getCurrentUser()?.id;
  }
}
