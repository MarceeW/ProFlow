import { RegisterModel } from '../../_models/register-model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorStateMatcher } from '../../_state-matchers/form-error-state-matcher';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthUser } from '../../_models/auth-user';
import { InvitationService } from '../../_services/invitation.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup(
    {
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl(new Date(), [Validators.required]),
    }
  );
  matcher = new FormErrorStateMatcher();
  maxDate = new Date();
  invitationKey: string | null = null;
  invitationValid = true;

  constructor(
      public invitationService: InvitationService,
      private accountService: AccountService,
      private toastr: ToastrService,
      private router: Router,
      private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getInvitationKey();
    if (this.invitationKey == null) {
      this.invitationValid = false;
      return;
    }

    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.invitationService.readInvitation(this.invitationKey).pipe().subscribe({
      next: invitation => {
        this.invitationValid = !invitation.isActivated && new Date() < new Date(invitation.expires)
         && this.invitationKey != null;
      },
      error: _ => this.invitationValid = false
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value as RegisterModel, this.invitationKey)
        .subscribe({
          next: (user: AuthUser) => {
            this.router.navigateByUrl('');
            this.toastr.success(`Welcome to ProFlow, ${user.userName}!`);
          }
        });
    }
  }

  getInvitationKey() {
    this.invitationKey = this.route.snapshot.queryParamMap.get('invitationKey');
  }
}
