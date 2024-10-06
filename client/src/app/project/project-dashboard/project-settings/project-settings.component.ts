import { Component } from '@angular/core';
import { ProjectDashBoardBase } from '../project-dashboard-base.component';

@Component({
  selector: 'app-project-settings',
  standalone: true,
  imports: [],
  templateUrl: './project-settings.component.html',
  styleUrl: './project-settings.component.scss'
})
export class ProjectSettingsComponent extends ProjectDashBoardBase {
  override itemKey: string = 'settings';
}
