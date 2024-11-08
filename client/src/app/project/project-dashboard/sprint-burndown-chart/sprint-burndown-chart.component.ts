import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { SprintService } from '../../../_services/sprint.service';
import { BaseComponent } from '../../../_component-base/base.component';
import { SprintBurndownData } from '../../../_models/reports/sprint-burndown-data.model';
import { takeUntil } from 'rxjs';
import { LineChartModule } from '@swimlane/ngx-charts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sprint-burndown-chart',
  standalone: true,
  imports: [
    LineChartModule
  ],
  templateUrl: './sprint-burndown-chart.component.html',
  styleUrl: './sprint-burndown-chart.component.scss'
})
export class SprintBurndownChartComponent extends BaseComponent {
  readonly burndownDatas = signal<SprintBurndownData[]>([]);
  readonly sprintId = input.required<string>();
  private readonly _sprintService = inject(SprintService);

  constructor() {
    super();
    effect(() => {
      this.sprintId();
      untracked(() => this.loadSprint());
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

  }

  private loadSprint() {
    this._sprintService.getBurndownDatas(this.sprintId())
      .pipe(takeUntil(this._destroy$))
      .subscribe(datas => this.burndownDatas.set(datas));
  }
}
