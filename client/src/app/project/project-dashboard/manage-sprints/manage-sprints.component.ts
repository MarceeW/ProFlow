import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntil } from 'rxjs';
import { Project } from '../../../_models/project.model';
import { Sprint } from '../../../_models/sprint.model';
import { Story } from '../../../_models/story.model';
import { SprintService } from '../../../_services/sprint.service';
import { ProjectBaseComponent } from '../project-base.component';
import { StoryTileComponent } from '../story-tile/story-tile.component';
import { TeamSelectorComponent } from '../team-selector/team-selector.component';
import { SprintBacklogUpdateItem } from '../../../_models/sprint-backlog-update-item.model';

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
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    StoryTileComponent,
    TeamSelectorComponent
  ],
  templateUrl: './manage-sprints.component.html',
  styleUrl: './manage-sprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageSprintsComponent extends ProjectBaseComponent {
  override itemKey: string = 'managesprints';

  readonly productBacklog = signal<Story[]>([]);
  readonly sprintBacklog = signal<Story[]>([]);
  readonly lastSprint = signal<Sprint | undefined>(undefined);

  readonly isCapacityFull = computed(() => {
    return (this.lastSprint()?.capacity ?? 0) < this.sprintPoints();
  });
  readonly sprintPoints = signal<number>(0);

  readonly sprintCreateFormGroup = this._formBuilder.group({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    capacity: new FormControl(1, Validators.required),
  });
  readonly changeHappened = computed<boolean>(() => {
    return this._markedToAdd().length > 0 || this._markedToRemove().length > 0;
  });

  protected override _title = "Sprint management";

  private readonly _sprintService = inject(SprintService);
  private readonly _markedToAdd = signal<Story[]>([]);
  private readonly _markedToRemove = signal<Story[]>([]);

  constructor(private readonly _formBuilder: FormBuilder) {
    super();

    effect(() => {
      this.team();
      untracked(() => {
        if(!this.team())
          return;
        if(this.teamSprints().length > 0)
          this.loadNthSprint(0);
      });
    });

    effect(() => {
      this.project();
      untracked(() => {
        if(this.isTeamsEmpty())
          this.sprintCreateFormGroup.disable();
      });
    });

    effect(() => {
      this.lastSprint();
      untracked(() => {
        this.sprintCreateFormGroup.markAsPristine();
        if(this.lastSprint()?.isActive) {
          this.sprintCreateFormGroup.controls.startDate.setValue(this.lastSprint()!.start);
          this.sprintCreateFormGroup.controls.endDate.setValue(this.lastSprint()!.end);
          this.sprintCreateFormGroup.controls.capacity.setValue(this.lastSprint()!.capacity);
        } else {
          this.sprintCreateFormGroup.reset();
          this.sprintCreateFormGroup.controls.capacity.setValue(1);
        }
      });
    });
  }

  getMinStartDate() {
    return !this.lastSprint()?.isActive ? new Date() : new Date(this.lastSprint()!.start);
  }

  isSprintFormBtnDisabled() {
    return this.sprintCreateFormGroup.invalid && !this.lastSprint()?.isActive
      || this.sprintCreateFormGroup.controls.capacity.invalid
      || this.sprintCreateFormGroup.disabled
      || !this.sprintCreateFormGroup.dirty;
  }

  override onProjectLoaded(project: Project): void {
    super.onProjectLoaded(project);
    this.loadBacklog();
  }

  override onBacklogLoaded(stories: Story[]): void {
    this.productBacklog.set(stories.filter(story => !story.sprintId));
  }

  reload() {
    this.loadBacklog();
    this.loadNthSprint(0);
    this.resetMarkedStories();
  }

  saveBacklogChanges() {
    if(this._markedToAdd().length == 0 && this._markedToRemove().length == 0)
      return;

    const updateItems: SprintBacklogUpdateItem[] = this._markedToAdd()
      .map<SprintBacklogUpdateItem>(story => {
        return {
          id: story.id!,
          remove: false
        }
      })
      .concat(this._markedToRemove()
        .map<SprintBacklogUpdateItem>(story => {
          return {
            id: story.id!,
            remove: true
          }
        }));

    this._sprintService.updateBacklog(this.lastSprint()?.id!, updateItems)
      .pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this.reload();
        this._toastr.info(response);
    });
  }

  drop(event: CdkDragDrop<WritableSignal<Story[]>>, source: 'product' | 'sprint') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data(), event.previousIndex, event.currentIndex);
      return;
    }

    if(source == 'sprint') {
      const story = this.productBacklog()[event.previousIndex];
      this._markedToAdd.set([...this._markedToAdd(), story]);
      this.sprintPoints.update(points => points + (story.storyPoints ?? 0));
    } else {
      const story = this.sprintBacklog()[event.previousIndex];
      this.sprintPoints.update(points => points - (story.storyPoints ?? 0));
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
      event.previousContainer.data(),
      event.container.data(),
      event.previousIndex,
      event.currentIndex,
    );

    console.log(this._markedToAdd(), this._markedToRemove());
  }

  sprintFormBtnLabel() {
    return !this.lastSprint()?.isActive ? "Create sprint" : "Update sprint";
  }

  onSprintFormBtnPressed() {
    if(!this.lastSprint()?.isActive)
      this.createSprint();
    else
      this.updateSprint();
  }

  private updateSprint() {
    const sprint = this.getControlValueAsSprint();
    sprint.id = this.lastSprint()!.id!;
    this._sprintService.updateSprint(sprint)
      .pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this._toastr.success(response);
        this.loadBacklog();
        this.loadNthSprint(0);
      });
  }

  private createSprint() {
    this._projectService.addSprint(
      this.projectId,
      this.getControlValueAsSprint())
      .pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this._toastr.success(response);
        this.sprintCreateFormGroup.reset();
        this.loadProject();
        this.loadNthSprint(0);
      });
  }

  closeSprint() {
    this._sprintService.closeSprint(this.lastSprint()!.id!)
      .pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this.loadNthSprint(0);
        this._toastr.info(response);
      });
  }

  canCreateSprint(): boolean {
    if(!this.lastSprint())
      return true;
    return new Date(this.lastSprint()!.end) < new Date();
  }

  protected override onSprintLoaded(sprint?: Sprint): void {
    this.lastSprint.set(sprint);
    this.sprintBacklog.set(sprint?.sprintBacklog ?? []);
    this.sprintPoints.set(this.getSprintPoints());
  }

  private getControlValueAsSprint(): Sprint {
    return {
      start: new Date(this.sprintCreateFormGroup.controls.startDate.value!).toJSON(),
      end: new Date(this.sprintCreateFormGroup.controls.endDate.value!).toJSON(),
      teamId: this.team()!.id,
      capacity: this.sprintCreateFormGroup.controls.capacity.value!
    };
  }

  private getSprintPoints() {
    return this.sprintBacklog()
      .reduce((accumulator, story) => accumulator + (story.storyPoints ?? 0), 0);
  }

  private resetMarkedStories() {
    this._markedToAdd.set([]);
    this._markedToRemove.set([]);
  }
}
