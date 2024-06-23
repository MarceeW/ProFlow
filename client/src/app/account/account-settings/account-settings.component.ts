import { AccountSettingsModel } from './../../_models/account-settings-model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/user';
import { ReplaySubject, switchMap, take, takeUntil } from 'rxjs';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorStateMatcher } from '../../_state-matchers/form-error-state-matcher';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  userNameForm = new FormGroup({
    userName: new FormControl('')
  });
  userNameSaveEnabled = false;

  passwordForm = new FormGroup({
    password: new FormControl('')
  });
  passwordSaveEnabled = false;

  @ViewChild('imageInput') imageInput!: ElementRef;
  user?: User;
  private ngDestroy$ = new ReplaySubject<boolean>(1);

  constructor(
    public accountService: AccountService,
    private userService: UserService,
    private toastr: ToastrService) {}

    ngOnDestroy(): void {
      this.ngDestroy$.next(true);
      this.ngDestroy$.complete();
    }

    ngOnInit(): void {
      this.setCurrentUserModel();

      this.userNameForm.controls['userName'].valueChanges.pipe(takeUntil(this.ngDestroy$))
        .subscribe(value => {
          this.userNameSaveEnabled = value?.length! > 0
            && value?.toLowerCase() != this.user?.userName.toLowerCase();
      });

      this.passwordForm.controls['password'].valueChanges.pipe(takeUntil(this.ngDestroy$))
        .subscribe(value => this.passwordSaveEnabled = value?.length! > 0);
    }

    triggerImageInput() {
      this.imageInput.nativeElement.click();
    }

    onImageSelected(event: Event) {
      if(!this.user) {
        this.toastr.error('Error during file upload!');
        return;
      }

      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        this.accountService.uploadProfilePicture(file).pipe(take(1)).subscribe();
      }
      else {
        this.toastr.error('You can upload only one image!');
      }
    }

    onUserNameSave() {
      if(!this.user)
        return;

      const model: AccountSettingsModel = {
        userName: this.userNameForm.controls['userName'].value!
      };

      this.accountService.updateAccountSettings(model).pipe(take(1))
        .subscribe({
          next: _ => {
            this.userNameSaveEnabled = false;
            this.setCurrentUserModel();
            this.toastr.success("Username is saved successfully!");
          }
      });
    }

    onPasswordSave() {
      if(!this.user)
        return;

      const model: AccountSettingsModel = {
        password: this.passwordForm.controls['password'].value!
      };

      this.accountService.updateAccountSettings(model).pipe(take(1))
        .subscribe({
          next: _ => {
            this.passwordForm.controls['password'].setValue('');
            this.passwordSaveEnabled = false;
            this.toastr.success("Password is saved successfully!");
          }
      });
    }

    private setCurrentUserModel() {
      this.userService.getCurrentUser()?.pipe(take(1))
        .subscribe(user => this.user = user);
    }
  }
