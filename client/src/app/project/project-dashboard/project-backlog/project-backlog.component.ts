import { Component } from '@angular/core';
import { ProjectDashBoardBase } from '../project-dashboard-base.component';

@Component({
  selector: 'app-project-backlog',
  standalone: true,
  imports: [],
  templateUrl: './project-backlog.component.html',
  styleUrl: './project-backlog.component.scss'
})
export class ProjectBacklogComponent extends ProjectDashBoardBase {
  override itemKey: string = 'backlog';
}
