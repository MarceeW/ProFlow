import { Component } from '@angular/core';
import { ProjectDashBoardBase } from '../project-dashboard-base.component';

@Component({
  selector: 'app-project-timeline',
  standalone: true,
  imports: [],
  templateUrl: './project-timeline.component.html',
  styleUrl: './project-timeline.component.scss'
})
export class ProjectTimelineComponent extends ProjectDashBoardBase{
  override itemKey: string = 'timeline';
}
