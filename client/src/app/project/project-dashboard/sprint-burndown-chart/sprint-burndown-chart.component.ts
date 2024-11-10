import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { SprintService } from '../../../_services/sprint.service';
import { BaseComponent } from '../../../_component-base/base.component';
import { ChartData } from '../../../_models/reports/chart-data.model';
import { takeUntil } from 'rxjs';
import { Color, LineChartModule, ScaleType } from '@swimlane/ngx-charts';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_NO_TITLE_CONFIG } from '../../../injection-tokens.config';

@Component({
  selector: 'app-sprint-burndown-chart',
  standalone: true,
  imports: [
    LineChartModule
  ],
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_NO_TITLE_CONFIG
    }
  ],
  templateUrl: './sprint-burndown-chart.component.html',
  styleUrl: './sprint-burndown-chart.component.scss'
})
export class SprintBurndownChartComponent extends BaseComponent {
  readonly burndownDatas = signal<ChartData[]>([]);
  readonly sprintId = input.required<string>();
  colorScheme: Color = {
    domain: ['#0073ff', '#ff0055'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
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
