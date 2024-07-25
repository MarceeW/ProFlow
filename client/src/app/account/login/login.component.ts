import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginModel } from '../../_models/login-model';
import { AsyncPipe } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorStateMatcher } from '../../_state-matchers/form-error-state-matcher';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  matcher = new FormErrorStateMatcher();

  constructor(private accountService: AccountService, private toastr: ToastrService,
    private router: Router) {}

  login() {
    const loginModel = this.loginForm.value as LoginModel;
    this.accountService.login(loginModel).subscribe({
      next: _ => {
        this.router.navigateByUrl('');
        this.toastr.success(`Welcome back, ${loginModel.userName}!`);
      },
      error: error => console.error(error)
    });
  }
}
