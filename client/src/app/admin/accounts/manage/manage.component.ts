import { MatCheckboxModule } from '@angular/material/checkbox';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account } from '../../../_models/account';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { Role } from '../../../_models/role';
import { FormBuilder, FormsModule, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { UserManageModel } from '../../../_models/user-manage-model';
import { AdminService } from '../../../_services/admin.service';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatDividerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit {

  manageFormGroup = this.formBuilder.group({
    roles: this.formBuilder.array([])
  });

  get roleControls() {
    return this.manageFormGroup.get('roles') as FormArray;
  }

  @Output()
  closeEvent = new EventEmitter<null>();

  @Output()
  saveEvent = new EventEmitter<Account>();

  @Input()
  set user(value: Account) {
    this.manageModel = { userName: value.userName, deletedRoles: [], newRoles: [] }
    this._user = value;
  }

  get user() {
    return this._user;
  }
  private _user!: Account;
  private manageModel!: UserManageModel;

  @Input()
  availableRoles!: Role[];

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.availableRoles.forEach(r => {
      const control = this.formBuilder.control(this.user.roles.includes(r.name));
      if(r.default)
        control.disable();
      this.roleControls.push(control);
    });
  }

  onSave() {
    this.saveRoles();
    this.adminService.updateUser(this.manageModel)
      .pipe()
      .subscribe({
        next: result => {
          this.user = result;
          this.toastr.success("Saved successfully!");
          this.saveEvent.emit(this.user);
          this.reset(result);
        }
      });
  }

  onChange(role: string, checked: boolean) {
    if (checked && !this.user.roles.includes(role)) {
        this.manageModel.newRoles.push(role);
    }
    else if (!this.manageModel.deletedRoles.includes(role)) {
      this.manageModel.deletedRoles.push(role);
    }
  }

  onClose() {
    this.closeEvent.emit();
  }

  private saveRoles() {
    for (let i = 0; i < this.roleControls.length; i++) {
      const control = this.roleControls.at(i);
      const checked: boolean = control.value;
      const role = this.availableRoles[i].name;

      if(control.dirty) {
        if(checked) {
          if(!this.user.roles.includes(role)) {
            this.manageModel.newRoles.push(role);
          }
        } else {
          if(this.user.roles.includes(role)) {
            this.manageModel.deletedRoles.push(role);
          }
        }
      }
    }
  }

  private reset(user: Account) {
    this.user = user;
    this.manageFormGroup.markAsPristine();
  }
}
