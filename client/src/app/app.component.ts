import { Component, inject } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RoleType } from './_enums/role-type.enum';
import { AuthUser } from './_models/auth-user';
import { AccountService } from './_services/account.service';
import { ComponentArgsService } from './_services/component-args.service';
import { SidenavItemService } from './_services/sidenav-item.service';
import { NavMenuComponent } from './main-nav/nav-menu/nav-menu.component';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  roleType = RoleType;

  readonly sidenavItemService = inject(SidenavItemService);
  readonly accountService = inject(AccountService);
  readonly argsService = inject(ComponentArgsService);
  readonly matIconRegistry = inject(MatIconRegistry);

  ngOnInit(): void {
    this.setupCurrentUser();
    this.accountService.loadCurrentUserProfilePicture();
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  setupCurrentUser() {
    const user: AuthUser | null = this.accountService.getCurrentAuthUser();
    if(!user)
      return;

    this.accountService.setCurrentUser(user);
  }
}
