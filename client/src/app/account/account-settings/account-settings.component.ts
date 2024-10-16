import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { UserService } from '../../_services/user.service';
import { AccountSettingsModel } from './../../_models/account-settings-model';

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
        this.accountService.uploadCurrentUserProfilePicture(file).pipe(take(1)).subscribe();
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
      this.user = this.accountService.getCurrentUser()!;
    }
  }
