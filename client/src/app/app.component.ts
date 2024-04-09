import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { LoginComponent } from './account/login/login.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    NavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProFlow';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User | null = this.accountService.getCurrentUser();
    if(!user)
      return;

    this.accountService.setCurrentUser(user);
  }
}
