import { Component, OnInit } from '@angular/core';
import { ListComponent } from './list/list.component';
import { CommonModule } from '@angular/common';
import { Role } from '../../_models/role';
import { ManageComponent } from './manage/manage.component';
import { User } from '../../_models/user';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    ListComponent,
    ManageComponent,
    CommonModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent implements OnInit {
  profileUnderManage: boolean = false;
  availableRoles!: Role[];
  editedUser: User | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getRoles().pipe().subscribe({
      next: roles => this.availableRoles = roles
    });
  }

  toggleManage(value: boolean) {
    this.profileUnderManage = value;
  }

  setEditedUser(user: User | null) {
    this.editedUser = user;
  }
}
