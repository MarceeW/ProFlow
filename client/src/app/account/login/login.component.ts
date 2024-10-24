import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../_component-base/base.component';
import { LoginModel } from '../../_models/login-model';
import { AccountService } from '../../_services/account.service';
import { FormErrorStateMatcher } from '../../_state-matchers/form-error-state-matcher';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  matcher = new FormErrorStateMatcher();

  protected override _clipIntoContainer = false;
  protected override _showNavBar = false;

  private readonly _accountService = inject(AccountService);
  private readonly _router = inject(Router);

  login() {
    const loginModel = this.loginForm.value as LoginModel;
    this._accountService.login(loginModel)
      .pipe(takeUntil(this._destroy$))
      .subscribe(_ => {
        this._router.navigateByUrl('');
        this._toastr.success(`Welcome back!`);
      });
  }
}
