import { Component, OnDestroy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ProjectBaseComponent } from './project-base.component';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [
    MatDividerModule,
  ],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss'
})
export class ProjectDashboardComponent extends ProjectBaseComponent implements OnDestroy {
  override itemKey: string = 'dashboard';
  protected override _title = 'Dashboard';
}
