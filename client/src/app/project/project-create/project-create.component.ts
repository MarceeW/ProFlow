import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormErrorStateMatcher } from '../../_state-matchers/form-error-state-matcher';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/user';
import { MatOptionModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatIconModule,
    MatOptionModule,
    MatChipsModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent implements OnInit {
  projectCreateForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    teamLeader: new FormControl('')
  });
  users: User[] = [];
  teamLeaders: User[] = [];

  errorStateMatcher = new FormErrorStateMatcher();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().pipe().subscribe({
      next: users => this.users = users
    });
  }
}
