import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RoleType } from '../../_enums/role-type.enum';
import { AccountService } from '../../_services/account.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    RouterOutlet,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  constructor(public accountService: AccountService) {}

  get RoleType() {
    return RoleType;
  }
}
