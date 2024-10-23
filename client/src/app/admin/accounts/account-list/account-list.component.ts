import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../_component-base/base.component';
import { Account } from '../../../_models/account';
import { AdminService } from '../../../_services/admin.service';

@Component({
  selector: 'app-account-list-invitation',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent extends BaseComponent {
  readonly displayedColumns: string[] = ["name", "userName", "roles", "actions"]
  readonly accounts = signal<Account[]>([]);
  readonly filterControl = new FormControl('');

  readonly manageEvent = output<Account>();
  private readonly _adminService = inject(AdminService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.listAccounts();
  }

  search() {
    this.startLoading();
    this._adminService.getFilteredAccounts(this.filterControl.value ?? '')
      .pipe(takeUntil(this._destroy$))
      .subscribe(accounts => {
        this.accounts.set(accounts);
        this.stopLoading();
      });
  }

  listAccounts() {
    this.startLoading();
    this._adminService.getAccounts()
      .pipe(takeUntil(this._destroy$))
      .subscribe(accounts => {
        this.accounts.set(accounts);
        this.stopLoading();
      });
  }

  onManage(account: Account) {
    this.manageEvent.emit(account);
  }

  refresh() {
    if (this.filterControl.value) {
      this.search();
      return;
    }
    this.listAccounts();
  }

  getFormattedRoleName(roleName: string) {
    return roleName.replace('_', ' ');
  }
}
