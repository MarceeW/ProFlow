import { Component } from '@angular/core';

import { AccountService } from './_services/account.service';
import { AuthUser } from './_models/auth-user';
import { LoginComponent } from './account/login/login.component';
import { MainNavComponent } from './main-nav/main-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoginComponent,
    MainNavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ProFlow';

  constructor(private accountService: AccountService) {}

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
