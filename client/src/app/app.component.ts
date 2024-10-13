import { Component, inject } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RoleType } from './_enums/role-type.enum';
import { AuthUser } from './_models/auth-user';
import { AccountService } from './_services/account.service';
import { SidenavItemService } from './_services/sidenav-item.service';
import { AccountMenuComponent } from './main-nav/account-menu/account-menu.component';
import { NavMenuComponent } from './main-nav/nav-menu/nav-menu.component';
import { NotificationMenuComponent } from './main-nav/notification-menu/notification-menu.component';
import { ComponentLoadStatusService } from './_services/component-load-status.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterModule,
    NavMenuComponent,
    NotificationMenuComponent,
    AccountMenuComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ProFlow';
  roleType = RoleType;

  readonly sidenavItemService = inject(SidenavItemService);
  readonly accountService = inject(AccountService);
  readonly loadService = inject(ComponentLoadStatusService);

  ngOnInit(): void {
    this.setupCurrentUser();
    this.accountService.loadProfilePicture();
  }

  setupCurrentUser() {
    const user: AuthUser | null = this.accountService.getCurrentUser();
    if(!user)
      return;

    this.accountService.setCurrentUser(user);
  }
}
