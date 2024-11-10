import { Component, inject, input, signal } from '@angular/core';
import { ProjectService } from '../../../_services/project.service';
import { BaseComponent } from '../../../_component-base/base.component';
import { StoryStatusChange } from '../../../_models/story-status-change.model';
import { takeUntil } from 'rxjs';
import { ScrumStatePipe } from '../../../_pipes/scrum-state.pipe';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Story } from '../../../_models/story.model';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { UserPictureDirective } from '../../../_directives/user-picture.directive';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_NO_TITLE_CONFIG } from '../../../injection-tokens.config';

@Component({
  selector: 'app-project-updates-list',
  standalone: true,
  imports: [
    ScrumStatePipe,
    DatePipe,
    MatTooltip,
    MatIconModule,
    UserPictureDirective,
  ],
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_NO_TITLE_CONFIG
    }
  ],
  templateUrl: './project-updates-list.component.html',
  styleUrl: './project-updates-list.component.scss'
})
export class ProjectUpdatesListComponent extends BaseComponent {
  readonly projectId = input.required<string>();
  readonly updates = signal<StoryStatusChange[]>([]);
  private readonly _projectService = inject(ProjectService);
  private readonly _dialog = inject(MatDialog);

  override ngOnInit(): void {
    super.ngOnInit();
    this._projectService.getProjectUpdates(this.projectId())
      .pipe(takeUntil(this._destroy$))
      .subscribe(updates => this.updates.set(updates));
  }

  onStoryClicked(story: Story) {
    this._dialog.open(StoryDialogComponent, {
      minWidth: 600,
      data: story
    })
  }
}
