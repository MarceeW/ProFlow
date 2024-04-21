import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models/user';
import { AccountService } from '../../../_services/account.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ["roles", "name", "userName"]
  accounts: User[] = [];
  filterString: string = "";

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getUsers().pipe().subscribe({
      next: accounts => this.accounts = accounts
    });
  }

  onSearch() {
    this.accountService.getFilteredUsers(this.filterString).pipe().subscribe({
      next: accounts => this.accounts = accounts
    });
  }
}
