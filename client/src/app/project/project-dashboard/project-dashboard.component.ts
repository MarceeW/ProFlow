import { Component, computed, OnDestroy, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { takeUntil } from 'rxjs';
import { BacklogStat } from '../../_models/reports/backlog-stat.model';
import { ProjectBaseComponent } from './project-base.component';
import { ProjectUpdatesListComponent } from './project-updates-list/project-updates-list.component';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [
    MatDividerModule,
    NgxChartsModule,
    ProjectUpdatesListComponent
  ],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent extends ProjectBaseComponent implements OnDestroy {
  override itemKey: string = 'dashboard';

  readonly pbState = computed<{name: string, value: number}[]>(() => {
    const statuses = ['Backlog', 'In progress', 'Code review', 'Done'];
    return this._backlogStats().map(stat => {
      return {
        name: statuses[stat.storyStatus],
        value: stat.count
      };
    });
  });
  readonly pbPieChartColors = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  readonly pbPieChartLegendPos = LegendPosition.Right;

  protected override _title = 'Dashboard';

  private readonly _backlogStats = signal<BacklogStat[]>([]);

  override ngOnInit(): void {
    super.ngOnInit();
    this._loadBacklogStats();
  }

  private _loadBacklogStats() {
    this._projectService.getBacklogStats(this.projectId)
      .pipe(takeUntil(this._destroy$))
      .subscribe(stats => this._backlogStats.set(stats));
  }
}
