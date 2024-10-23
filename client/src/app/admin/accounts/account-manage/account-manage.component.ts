import { CommonModule } from '@angular/common';
import { Component, inject, model, output, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../_component-base/base.component';
import { Account } from '../../../_models/account';
import { Role } from '../../../_models/role';
import { UserManageModel } from '../../../_models/user-manage-model';
import { AdminService } from '../../../_services/admin.service';
import { AccountService } from '../../../_services/account.service';
import { RoleType } from '../../../_enums/role-type.enum';
import { UserPictureDirective } from '../../../_directives/user-picture.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { MemberSearchControlComponent } from '../../../_controls/member-search-control/member-search-control.component';
import { User } from '../../../_models/user';

@Component({
  selector: 'app-account-manage',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    UserPictureDirective,
    MemberSearchControlComponent
  ],
  templateUrl: './account-manage.component.html',
  styleUrl: './account-manage.component.scss'
})
export class AccountManageComponent extends BaseComponent {
  readonly account = model<Account>();

  readonly closeEvent = output<boolean>();
  readonly saveEvent = output();

  readonly addedRoles = new Set<string>();
  readonly removedRoles = new Set<string>();

  readonly availableRoles = signal<Role[]>([]);
  readonly showDeputyField = signal<boolean>(false);
  readonly deputyControl = viewChild(MemberSearchControlComponent);
  readonly deleteBtn = viewChild<MatButton>('deleteBtn');

  readonly RoleType = RoleType;

  private readonly _accountService = inject(AccountService);
  private readonly _adminService = inject(AdminService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadRoles();
  }

  onDelete() {
    if(!this.account())
      return;

    const deputyManager = this.deputyControl() && this.deputyControl()!.value.length > 0
      ? this.deputyControl()?.value[0] : undefined;

    this._adminService.deleteAccount(this.account()!.id, deputyManager)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.showDeputyField.set(false);
          this._toastr.success('Account deleted successfully');
          this.closeEvent.emit(true);
        },
        error: (error: HttpErrorResponse) => {
          if(error.status != 400)
            return;
          this.showDeputyField.set(true);
        }
      });
  }

  toggleRole(event: MatCheckboxChange) {
    const roleName = event.source.value;
    const userHasRole = this.account()?.roles.includes(roleName)

    if(userHasRole && !event.checked)
      this.removedRoles.add(roleName);
    else if(!event.checked) {
      this.addedRoles.delete(roleName);
    }

    if(!userHasRole && event.checked)
      this.addedRoles.add(roleName);
    else if(event.checked)
      this.removedRoles.delete(roleName);
  }

  accountAsUser(): User {
    const user: User = {
      id: this.account()!.id,
      userName: this.account()!.userName,
      fullName: `${this.account()!.firstName} ${this.account()!.lastName}`
    }
    return user;
  }

  userHasRole(roleName: string) {
    return this.account()?.roles.includes(roleName);
  }

  disabledRoleEditing(role: Role) {
    return role.default
      || this.account()?.userName == this._accountService.getCurrentUser()?.userName
      && role.name == RoleType.Administrator;
  }

  disabledDeletAccountBtn() {
    return this.account()?.userName == this._accountService.getCurrentUser()?.userName;
  }

  loadRoles() {
    this._adminService.getRoles()
    .pipe(takeUntil(this._destroy$))
      .subscribe(roles => {
        this.availableRoles.set(roles);
      });
  }

  getFormattedRoleName(roleName: string) {
    return roleName.replace('_', ' ');
  }

  onSave() {
    if(!this.account()) {
      console.error("Account is null, can't save");
      return;
    }

    this._adminService.updateAccount({
      userName: this.account()!.userName,
      newRoles: Array.from(this.addedRoles),
      deletedRoles: Array.from(this.removedRoles)
    })
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: result => {
          this.account.set(result);
          this.addedRoles.clear();
          this.removedRoles.clear();
          this._toastr.success("Saved successfully!");
          this.saveEvent.emit();
          this.closeEvent.emit(true);
        }
      });
  }
}
