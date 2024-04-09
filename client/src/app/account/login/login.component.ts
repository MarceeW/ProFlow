import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../_models/loginModel';
import { AsyncPipe } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

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
  model : LoginModel = { username:'', password:'' };

  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => this.toastr.success(`Welcome back, ${this.model.username}!`),
      error: error => console.error(error)
    });
  }
}
