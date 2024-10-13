import { Component, inject, signal } from '@angular/core';
import { ProjectDashBoardBase } from '../project-dashboard-base.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { takeUntil } from 'rxjs';
import { Sprint } from '../../../_models/sprint.model';
import { Project } from '../../../_models/project.model';
import { DatePipe } from '@angular/common';
import { SprintService } from '../../../_services/sprint.service';

@Component({
  selector: 'app-manage-sprints',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './manage-sprints.component.html',
  styleUrl: './manage-sprints.component.scss'
})
export class ManageSprintsComponent extends ProjectDashBoardBase {
  override itemKey: string = 'managesprints';

  private readonly _formBuilder = inject(FormBuilder);
  readonly sprintCreateFormGroup = this._formBuilder.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  });
  readonly lastSprint = signal<Sprint | undefined>(undefined);
  readonly minStartDate = new Date();

  private readonly _sprintService = inject(SprintService);

  override onProjectLoaded(project: Project): void {
    super.onProjectLoaded(project);
    this.loadNthSprint(0);
  }

  createSprint() {
    this._projectService.addSprint(this.projectId, {
      start: new Date(this.sprintCreateFormGroup.controls.startDate.value!)
        .toJSON().split('T')[0],
      end: new Date(this.sprintCreateFormGroup.controls.endDate.value!)
        .toJSON().split('T')[0]
    }).pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this.sprintCreateFormGroup.controls.startDate.setValue('');
        this.sprintCreateFormGroup.controls.endDate.setValue('');
        this.sprintCreateFormGroup.markAsUntouched();
        this._toastr.success(response);
        this.loadProject();
        this.loadNthSprint(0);
      });
  }

  closeSprint() {
    this._sprintService.closeSprint(this.lastSprint()!.id!)
      .pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this._toastr.info(response);
        this.loadNthSprint(0);
      });
  }

  canCreateSprint(): boolean {
    if(!this.lastSprint())
      return false;
    return !this.lastSprint()?.earlyClose
      || new Date(this.lastSprint()!.end) < new Date();
  }

  protected override onSprintLoaded(sprint: Sprint): void {
    this.lastSprint.set(sprint);
  }
}
