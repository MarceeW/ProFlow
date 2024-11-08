import { Component, computed, OnDestroy, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { takeUntil } from 'rxjs';
import { BacklogStat } from '../../_models/reports/backlog-stat.model';
import { ProjectBaseComponent } from './project-base.component';
import { ProjectUpdatesListComponent } from './project-updates-list/project-updates-list.component';
import { SprintBurndownChartComponent } from './sprint-burndown-chart/sprint-burndown-chart.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Sprint } from '../../_models/sprint.model';
import { DatePipe } from '@angular/common';
import { TeamSelectorComponent } from './team-selector/team-selector.component';
import { Project } from '../../_models/project.model';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [
    MatDividerModule,
    NgxChartsModule,
    ProjectUpdatesListComponent,
    SprintBurndownChartComponent,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TeamSelectorComponent,
    DatePipe
  ],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent extends ProjectBaseComponent implements OnDestroy {
  override itemKey: string = 'dashboard';

  readonly sprintSelectControl = new FormControl<Sprint | undefined>(undefined);
  readonly pbState = computed<{name: string, value: number}[]>(() => {
    const statuses = ['Backlog', 'In progress', 'Code review', 'Done'];
    return this._backlogStats().map(stat => {
      return {
        name: statuses[stat.storyStatus],
        value: stat.count
      };
    });
  });
  readonly pbPieChartLegendPos = LegendPosition.Right;

  protected override _title = 'Dashboard';

  private readonly _backlogStats = signal<BacklogStat[]>([]);

  override ngOnInit(): void {
    super.ngOnInit();
    this._loadBacklogStats();
  }

  override onProjectLoaded(project: Project): void {
    super.onProjectLoaded(project);
    this.sprintSelectControl.setValue(project.sprints![0])
  }

  compareSprint(s1: Sprint, s2?: Sprint) {
    return s1.id === s2?.id;
  }

  private _loadBacklogStats() {
    this._projectService.getBacklogStats(this.projectId)
      .pipe(takeUntil(this._destroy$))
      .subscribe(stats => this._backlogStats.set(stats));
  }
}
