import { Component } from '@angular/core';
import { ProjectBaseComponent } from '../project-base.component';

@Component({
  selector: 'app-project-timeline',
  standalone: true,
  imports: [],
  templateUrl: './project-timeline.component.html',
  styleUrl: './project-timeline.component.scss'
})
export class ProjectTimelineComponent extends ProjectBaseComponent{
  override itemKey: string = 'timeline';
}
