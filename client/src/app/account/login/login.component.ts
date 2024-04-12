import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../_models/loginModel';
import { AsyncPipe } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    NgbAlert
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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
