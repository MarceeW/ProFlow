import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntil } from 'rxjs';
import { Project } from '../../../_models/project.model';
import { Sprint } from '../../../_models/sprint.model';
import { Story } from '../../../_models/story.model';
import { SprintService } from '../../../_services/sprint.service';
import { ProjectDashBoardBase } from '../project-dashboard-base.component';

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
    DatePipe,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag
  ],
  templateUrl: './manage-sprints.component.html',
  styleUrl: './manage-sprints.component.scss'
})
export class ManageSprintsComponent extends ProjectDashBoardBase {
  override itemKey: string = 'managesprints';

  productBacklog: Story[] = [];
  sprintBacklog: Story[] = [];

  private readonly _formBuilder = inject(FormBuilder);
  readonly sprintCreateFormGroup = this._formBuilder.group({
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  });
  readonly lastSprint = signal<Sprint | undefined>(undefined);
  readonly minStartDate = new Date();
  readonly changeHappened = computed<boolean>(() => {
    return this._markedToAdd().length > 0 || this._markedToRemove().length > 0;
  });

  protected override _title = "Manage sprint";

  private readonly _sprintService = inject(SprintService);
  private readonly _markedToAdd = signal<Story[]>([]);
  private readonly _markedToRemove = signal<Story[]>([]);

  override onProjectLoaded(project: Project): void {
    super.onProjectLoaded(project);
    this.loadBacklog();
    this.loadNthSprint(0);
  }

  override onBacklogLoaded(stories: Story[]): void {
    this.productBacklog = stories;
  }

  saveBacklogChanges() {
    if(this._markedToAdd().length > 0) {
      this._sprintService.addStories(this.lastSprint()?.id!, this._markedToAdd())
        .pipe(takeUntil(this._destroy$))
        .subscribe(response => {
          this.loadDatas();
          this._toastr.success(response);
        });
    } else {
      this._sprintService.removeStories(this.lastSprint()?.id!, this._markedToRemove())
        .pipe(takeUntil(this._destroy$))
        .subscribe(response => {
          this.loadDatas();
          this._toastr.success(response);
        });;
    }
  }

  drop(event: CdkDragDrop<Story[]>, source: 'product' | 'sprint') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    if(source == 'sprint') {
      const story = this.productBacklog[event.previousIndex];
      this._markedToAdd.set([...this._markedToAdd(), story]);
    } else {
      const story = this.sprintBacklog[event.previousIndex];
      if(story.sprintId) {
        this._markedToRemove.set([...this._markedToRemove(), story]);
      } else {
        this._markedToAdd.update(stories => {
          const idx = stories.indexOf(story);
          stories.splice(idx, 1);
          return stories;
        })
      }
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
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
    this.sprintBacklog = sprint.sprintBacklog ?? [];
  }

  private resetMarkedStories() {
    this._markedToAdd.set([]);
    this._markedToRemove.set([]);
  }

  private loadDatas() {
    this.loadBacklog();
    this.loadNthSprint(0);
    this.resetMarkedStories();
  }
}
