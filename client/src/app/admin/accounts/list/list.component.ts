import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Account } from '../../../_models/account';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../_services/admin.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ["name", "userName", "roles", "actions"]
  accounts!: Account[];
  filterString: string = "";

  @Output()
  manageEvent = new EventEmitter<Account>();

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.listAccounts();
  }

  search() {
    this.adminService.getFilteredUsers(this.filterString).pipe().subscribe({
      next: accounts => this.accounts = accounts
    });
  }

  listAccounts() {
    this.adminService.getUsers().pipe().subscribe({
      next: accounts => this.accounts = accounts
    });
  }

  onManage(user: Account) {
    this.manageEvent.emit(user);
  }

  refresh() {
    if (this.filterString === "") {
      this.listAccounts();
      return;
    }
    this.search();
  }
}
