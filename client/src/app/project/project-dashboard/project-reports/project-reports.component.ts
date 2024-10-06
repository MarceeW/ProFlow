import { Component } from '@angular/core';
import { ProjectDashBoardBase } from '../project-dashboard-base.component';

@Component({
  selector: 'app-project-reports',
  standalone: true,
  imports: [],
  templateUrl: './project-reports.component.html',
  styleUrl: './project-reports.component.scss'
})
export class ProjectReportsComponent extends ProjectDashBoardBase {
  override itemKey: string = 'reports';
}
