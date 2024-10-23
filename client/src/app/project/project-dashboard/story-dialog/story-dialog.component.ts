import { DatePipe } from '@angular/common';
import { Component, effect, inject, model, signal, untracked } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../_component-base/base.component';
import { UserPictureDirective } from '../../../_directives/user-picture.directive';
import { Story } from '../../../_models/story.model';
import { AccountService } from '../../../_services/account.service';
import { StoryService } from '../../../_services/story.service';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_DIALOG_CONFIG } from '../../../injection-tokens.config';
import { StoryCommitComponent } from './story-commit/story-commit.component';

@Component({
  selector: 'app-story-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DatePipe,
    UserPictureDirective,
    StoryCommitComponent
  ],
  templateUrl: './story-dialog.component.html',
  styleUrl: './story-dialog.component.scss',
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_DIALOG_CONFIG
    }
  ]
})
export class StoryDialogComponent extends BaseComponent {
  readonly dialogData: Story = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<StoryDialogComponent>);

  readonly story = model<Story>(this.dialogData);
  readonly changed = signal(false);
  readonly planning = signal(false);
  readonly storyPointInputOpened = signal(false);
  readonly storyPointsControl = new FormControl();

  private readonly _accountService = inject(AccountService);
  private readonly _storyService = inject(StoryService);
  private readonly _router = inject(Router);

  constructor() {
    super();
    effect(() => {
      this.story();
      untracked(() => this.storyPointsControl
        .setValue(this.story().storyPoints));
    });

  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.changed());
    });
    this.planning.set(this._router.url.includes('manage-sprints'));
  }

  setAssignation(assign: boolean) {
    const userId = this._accountService.getCurrentAuthUser()?.id;

    if(!userId)
      return;

    const obs = assign ?
      this._storyService.assign(this.story().id!, userId) :
      this._storyService.unassign(this.story().id!, userId)

    obs.pipe(takeUntil(this._destroy$))
    .subscribe(response => {
      this._toastr.success(response);
      this.changed.set(true);
      this.reloadStory();
    });
  }

  isStoryAssignedToCurrentUser() {
    return this.story().assignedTo &&
      this._accountService.getCurrentAuthUser()?.id == this.story().assignedTo?.id;
  }

  reloadStory() {
    this._storyService.getStory(this.story().id!)
      .pipe(takeUntil(this._destroy$))
      .subscribe(story => {
        this.story.set(story);
      });
  }

  openStoryPointsInput(event: MouseEvent) {
    this.storyPointInputOpened.set(true);
    event.stopPropagation();
  }

  onDialogClicked(event: MouseEvent) {
    if(this.storyPointInputOpened()) {
      this.storyPointInputOpened.set(false);
      this.updateStoryPoints();
      event.stopPropagation();
    }
  }

  private updateStoryPoints() {
    const points = this.storyPointsControl.value;

    if(!points && points === '0' || points == this.story().storyPoints)
      return;

    this.story.update(story => {
      story.storyPoints = Number(points);
      return story;
    });

    this.updateStory();
  }

  private updateStory() {
    this._storyService.updateStory(this.story())
      .pipe(takeUntil(this._destroy$))
      .subscribe(_ => {
        this._toastr.success("Story updated successfully");
        this.changed.set(true);
        this.reloadStory();
      });
  }
}
