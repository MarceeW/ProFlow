import { Component, ViewEncapsulation, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { NotificationMenuComponent } from './notification-menu/notification-menu.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { RoleType } from '../_enums/role-type.enum';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterModule,
    NavMenuComponent,
    NotificationMenuComponent,
    AccountMenuComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class MainNavComponent {
  private breakpointObserver = inject(BreakpointObserver);
  sidenavExpanded = false;

  get RoleType() {
    return RoleType;
  }

  constructor(public accountService: AccountService) {}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
}
