import { Component, inject, input, signal } from '@angular/core';
import { BaseComponent } from '../_component-base/base.component';
import { TeamService } from '../_services/team.service';
import { takeUntil } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartData } from '../_models/reports/chart-data.model';
import { BASE_COMPONENT_DEFAULT_CONFIG, BASE_COMPONENT_NO_TITLE_CONFIG } from '../injection-tokens.config';

@Component({
  selector: 'app-velocity-chart',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  providers: [
    {
      provide: BASE_COMPONENT_DEFAULT_CONFIG,
      useValue: BASE_COMPONENT_NO_TITLE_CONFIG
    }
  ],
  templateUrl: './velocity-chart.component.html',
  styleUrl: './velocity-chart.component.scss'
})
export class VelocityChartComponent extends BaseComponent {
  readonly teamId = input.required<string>();
  readonly data = signal<ChartData[]>([]);

  private readonly _teamService = inject(TeamService);

  override ngOnInit(): void {
    super.ngOnInit();
    this._teamService.getVelocityChartData(this.teamId())
      .pipe(takeUntil(this._destroy$))
      .subscribe(data => this.data.set(data));
  }
}
