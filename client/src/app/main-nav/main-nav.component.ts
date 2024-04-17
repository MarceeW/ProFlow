import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.css',
  standalone: true,
  imports: [
    CommonModule,
    BsDropdownModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterModule
  ]
})
export class MainNavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  constructor(public accountService: AccountService, private router: Router) {}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/login');
  }
}
