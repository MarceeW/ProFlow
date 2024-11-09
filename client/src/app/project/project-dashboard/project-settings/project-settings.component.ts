import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntil } from 'rxjs';
import { MemberSearchControlComponent } from '../../../_controls/member-search-control/member-search-control.component';
import { RoleType } from '../../../_enums/role-type.enum';
import { User } from '../../../_models/user.model';
import { ProjectBaseComponent } from '../project-base.component';
import { Project } from './../../../_models/project.model';

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MemberSearchControlComponent
  ],
  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.scss'
})
export class ProjectSettingsComponent extends ProjectBaseComponent {
  override itemKey: string = 'settings';
  protected override _title = "Project settings";

  readonly projectUpdateForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    teamLeaders: new FormControl<User[]>([], [Validators.required]),
  });
  readonly RoleType = RoleType;

  override onProjectLoaded(project: Project): void {
    super.onProjectLoaded(project);
    this.projectUpdateForm.controls.projectName.setValue(project.name);
    this.projectUpdateForm.controls.teamLeaders.setValue(project.teamLeaders);
  }

  updateProject() {
    if(!this.project())
      return;
    this.project()!.name = this.projectUpdateForm.controls.projectName.value!;
    this.project()!.teamLeaders = this.projectUpdateForm.controls.teamLeaders.value!;

    this._projectService.updateProject(this.project()!)
      .pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this._toastr.info(response);
        this.loadProject();
        this.projectUpdateForm.markAsPristine();
      });
  }
}
