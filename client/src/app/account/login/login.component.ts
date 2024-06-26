import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../_models/login-model';
import { AsyncPipe } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  model : LoginModel = { userName:'', password:'' };

  constructor(private accountService: AccountService, private toastr: ToastrService,
    private router: Router) {}

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('');
        this.toastr.success(`Welcome back, ${this.model.userName}!`);
      },
      error: error => console.error(error)
    });
  }
}
