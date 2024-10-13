import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipGrid } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MemberSearchControlComponent } from '../../_controls/member-search-control/member-search-control.component';
import { Project } from '../../_models/project.model';
import { ProjectService } from '../../_services/project.service';
import { UserService } from '../../_services/user.service';
import { User } from './../../_models/user';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatOptionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MemberSearchControlComponent
  ],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  projectCreateForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    teamLeaders: new FormControl<User[]>([], [Validators.required]),
  });
  @ViewChild('teamLeaderInput') teamLeaderInput!: ElementRef<HTMLInputElement>;
  @ViewChild('teamLeaderChipGrid') teamLeaderChipGrid!: MatChipGrid;

  private projectManager!: User;
  private ngDestroy$ = new ReplaySubject();

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router) {}

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  ngOnInit(): void {
    this.userService.getCurrentUser()?.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
        next: user => {
          this.projectManager = user;
        }
    });
  }

  createProject() {
    if(!this.projectCreateForm.valid)
      return;

    const project: Project = {
      name: this.projectCreateForm.controls.projectName.value!,
      projectManager: this.projectManager,
      teamLeaders: this.projectCreateForm.controls.teamLeaders.value!
    };
    this.projectService.createProject(project).pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe({
      next: _ => {
        this.toastr.success(`Project ${project.name} created successfully!`);
        this.router.navigateByUrl('projects');
      }
    });
  }
}
