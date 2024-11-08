import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntil } from 'rxjs';
import { Sprint } from '../../../_models/sprint.model';
import { Story } from '../../../_models/story.model';
import { StoryService } from '../../../_services/story.service';
import { ProjectBaseComponent } from '../project-base.component';
import { StoryTileComponent } from '../story-tile/story-tile.component';
import { TeamSelectorComponent } from '../team-selector/team-selector.component';
import { StoryStatus } from './../../../_enums/story-status.enum';
import { ScrumStatePipe } from '../../../_pipes/scrum-state.pipe';

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
    DatePipe,
    StoryTileComponent,
    TeamSelectorComponent,
    ScrumStatePipe
  ],
  templateUrl: './scrum-board.component.html',
  styleUrl: './scrum-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrumBoardComponent extends ProjectBaseComponent {
  override itemKey: string = 'scrumboard';

  readonly sprint = signal<Sprint | null>(null);

  readonly currentSprintIdx = signal(0);
  readonly stories = signal<Story[][]>(new Array(4));
  readonly stateDragIdPrefix = 'scrum-state-';
  readonly connectedStates = [
    [1], [0, 2], [1, 3], [1, 2]
  ];
  readonly sprintSelectControl = new FormControl<Sprint | undefined>(undefined);
  readonly nextBtnDisabled = computed(() => {
    return this._sprintIdx() == 0;
  });
  readonly backBtnDisabled = computed(() => {
    return this._sprintIdx() + 1 == this.teamSprints().length
      || this.teamSprints().length == 0;
  });
  private readonly _storyService = inject(StoryService);
  private readonly _sprintIdx = signal(0);

  compareSprint(s1: Sprint, s2?: Sprint) {
    return s1.id === s2?.id;
  }

  constructor() {
    super();
    effect(() => {
      this.team();
      untracked(() => {
        if(!this.team())
          return;
        this._sprintIdx.set(0);
        if(this.teamSprints().length > 0)
          this.loadNthSprint(0);
        else
          this.stories.set(new Array(this.stories().length));
      });
    });

    effect(() => {
      this._sprintIdx();
      untracked(() => {
        if(!this.team())
          return;
        this.loadNthSprint(this._sprintIdx());
      });
    });
  }

  getConnectedToIds(idx: number): string[] {
    return this.connectedStates[idx]
      .map(id => this.stateDragIdPrefix + id);
  }

  drop(event: CdkDragDrop<Story[]>, colIdx: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const story = event.previousContainer.data[event.previousIndex];
      this.updateStoryStatus(story, colIdx);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  updateStoryStatus(story: Story, status: StoryStatus) {
    story.storyStatus = status;
    this._storyService.updateStory(story)
      .pipe(takeUntil(this._destroy$))
      .subscribe(_ => {
        this._toastr.info("Story status updated");
      });
  }

  navigateToSprint(direction: number) {
    this._sprintIdx.update(idx => idx += direction);
  }

  selectSprint(event: MatSelectChange) {
    const idx = this.project()?.sprints?.findIndex(s => s.id == event.value.id);
    if(idx == undefined)
      return;
    this._sprintIdx.set(idx);
    this.loadNthSprint(this._sprintIdx());
  }

  protected override onSprintLoaded(sprint: Sprint): void {
    this.sprint.set(sprint);
    this.sprintSelectControl.setValue(sprint);
    this.filterStories(sprint);
  }

  private filterStories(sprint: Sprint) {
    if(!sprint.sprintBacklog)
      return;

    const stories = sprint.sprintBacklog;
    for (let i = 0; i < this.stories().length; i++) {
      this.stories.update(_stories => {
        _stories[i] = stories.filter(s => s.storyStatus == i);
        return _stories;
      });
    }
  }
}
