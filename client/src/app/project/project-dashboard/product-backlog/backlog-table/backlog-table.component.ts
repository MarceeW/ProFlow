import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../_component-base/base.component';
import { Story } from '../../../../_models/story.model';
import { ProjectService } from '../../../../_services/project.service';
import { StoryService } from '../../../../_services/story.service';

@Component({
  selector: 'app-backlog-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './backlog-table.component.html',
  styleUrl: './backlog-table.component.scss'
})
export class BacklogTableComponent extends BaseComponent {
  readonly projectId = input.required<string>();
  readonly backlogItems = signal<MatTableDataSource<Story>>(new MatTableDataSource());

  readonly cols = [
    'title', 'assignedTo', 'storyPriority', 'storyType',
    'created', 'closed', 'actions'
  ];

  private readonly _projectService = inject(ProjectService);
  private readonly _storyService = inject(StoryService);

  constructor() {
    super();
    effect(() => {
      this.projectId();
      untracked(() => this.loadBacklog());
    });
  }

  deleteStory(storyId: string) {
    this._storyService.deleteStory(storyId)
      .pipe(takeUntil(this._destroy$))
      .subscribe(response => {
        this._toastr.info(response);
        this.loadBacklog();
      });
  }

  loadBacklog() {
    this.loading.set(true);
    this._projectService.getBacklog(this.projectId())
      .pipe(takeUntil(this._destroy$))
      .subscribe(stories => {
        this.backlogItems.update(source => {
          source.data = stories;
          return source;
        });
        this.loading.set(false);
      });
  }
}
