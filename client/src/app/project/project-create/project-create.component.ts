import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipGrid } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../_component-base/base.component';
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
export class ProjectCreateComponent extends BaseComponent {
  projectCreateForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    teamLeaders: new FormControl<User[]>([], [Validators.required]),
  });
  @ViewChild('teamLeaderInput') teamLeaderInput!: ElementRef<HTMLInputElement>;
  @ViewChild('teamLeaderChipGrid') teamLeaderChipGrid!: MatChipGrid;

  protected override _title = 'New project';
  private projectManager!: User;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router) {
      super();
    }

  override ngOnInit(): void {
    super.ngOnInit();
    this.userService.getCurrentUser()?.pipe(
      takeUntil(this._destroy$)
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
      takeUntil(this._destroy$)
    ).subscribe({
      next: _ => {
        this.toastr.success(`Project ${project.name} created successfully!`);
        this.router.navigateByUrl('projects');
      }
    });
  }
}
