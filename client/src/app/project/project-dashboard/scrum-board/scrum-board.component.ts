import { jwtInterceptor } from './../../../_interceptors/jwt.interceptor';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild, ViewContainerRef } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { takeUntil } from 'rxjs';
import { EnumTypes } from '../../../_enums/enum-types.enum';
import { StoryStatus } from '../../../_enums/story-status.enum';
import { Project } from '../../../_models/project.model';
import { Sprint } from '../../../_models/sprint.model';
import { Story } from '../../../_models/story.model';
import { EnumService } from '../../../_services/enum.service';
import { SprintService } from '../../../_services/sprint.service';
import { ProjectDashBoardBase } from '../project-dashboard-base.component';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-scrum-board',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    DatePipe
  ],
  templateUrl: './scrum-board.component.html',
  styleUrl: './scrum-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrumBoardComponent extends ProjectDashBoardBase {
  override itemKey: string = 'scrumboard';

  readonly sprint = signal<Sprint | null>(null);
  readonly currentSprintIdx = signal(0);
  readonly stories = signal<Story[][]>(new Array(4));
  readonly states = ['Backlog', 'In progress', 'Under testing', 'Done'];
  readonly stateDragIdPrefix = 'scrum-state-';
  readonly connectedStates = [
    [1], [0, 2], [1, 3], [1, 2]
  ];
  readonly sprintSelectControl = new FormControl();
  readonly nextBtnDisabled = computed(() => {
    return this._sprintIdx() == 0;
  });
  readonly backBtnDisabled = computed(() => {
    return this._sprintIdx() + 1 == this.project()?.sprints?.length || !this.isProjectHasSprints();
  });
  private readonly _sprintService = inject(SprintService);
  private readonly _sprintIdx = signal(0);

  override ngOnInit(): void {
      super.ngOnInit();
      this.project
  }

  override onProjectLoaded(project: Project): void {
    super.onProjectLoaded(project);
    this.loadNthSprint(0);
  }

  getConnectedToIds(idx: number): string[] {
    return this.connectedStates[idx]
      .map(id => this.stateDragIdPrefix + id);
  }

  drop(event: CdkDragDrop<Story[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  navigateToSprint(direction: number) {
    this._sprintIdx.update(idx => idx += direction);
    this.loadNthSprint(this._sprintIdx());
  }

  selectSprint(event: MatSelectChange) {
    const idx = this.project()?.sprints?.findIndex(s => s.id == event.value);
    if(idx == undefined)
      return;
    this._sprintIdx.set(idx);
    this.loadNthSprint(this._sprintIdx());
  }

  protected override onSprintLoaded(sprint: Sprint): void {
    this.sprint.set(sprint);
    this.sprintSelectControl.setValue(sprint.id);
    this.filterStories(sprint);
  }

  private filterStories(sprint: Sprint) {
    if(!sprint.sprintBacklog)
      return;

    const stories = sprint.sprintBacklog;
    for (let i = 0; i < 4; i++) {
      this.stories.update(_stories => {
        _stories[i] = stories.filter(s => s.storyStatus == i);
        return _stories;
      });
    }
  }
}
